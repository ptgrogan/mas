/*
 * Copyright 2015 Paul T. Grogan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    var ExplicitEuler = require('./explicitEuler');

    /** 
     * The Simulator class executes a simulation of entities with events:
     *  - init: triggered after simulation execution is initialized 
     *  - advance: triggered after simulation execution is advanced by a time step
     *  - complete: triggered after simulation execution is complete
     * Override the isComplete method to specify alternate ending conditions.
     * @type Object
     */
    function Simulator() {
        this.time = 0;
        this.method = new ExplicitEuler();;
        this.handlers = new Array();
        this.entities = new Array();
        this.initTime = 0;
        this.maxTime = 1;
        this.timeStep = 1;
        // override default attributes or methods
        for(var n in arguments[0]) {
            this[n] = arguments[0][n];
        }
    };

    /**
     * Checks whether the simulation execution is complete (can override).
     * @returns {Boolean}
     */
    Simulator.prototype.isComplete = function() {
        return this.time >= this.maxTime;
    };

    /**
     * Executes this simulation as fast as possible. Initializes at an initial
     * time and advances with time step duration until complete.
     * @returns {undefined}
     */
    Simulator.prototype.execute = function() {
        this.init();
        while(!this.isComplete()) {
            this.advance();
        }
    };

    /**
     * Initializes this simulation to an initial time.
     * @returns {undefined}
     */
    Simulator.prototype.init = function() {
        var numEntities = this.entities.length; // cached to improve performance
        this.time = this.initTime;
        for(var i = 0; i < numEntities; i++) {
            this.entities[i].init(this);
        }
        this.trigger("init", this.time);
    };

    /**
     * Advances this simulation by a time step.
     * @returns {undefined}
     */
    Simulator.prototype.advance = function() {
        if(this.isComplete()) {
            return;
        }
        var numEntities = this.entities.length; // cached to improve performance
        for(var i = 0; i < numEntities; i++) {
            this.entities[i].tick(this);
        }
        for(var i = 0; i < numEntities; i++) {
            this.entities[i].tock();
        }
        this.time += this.timeStep;
        this.trigger("advance", this.time);
        if(this.isComplete()) {
            this.trigger("complete", this.time);
        }
    };

    /**
     * Triggers an event with data.
     * @param {String} event the event name
     * @param {Object} data the event data
     * @returns {undefined}
     */
    Simulator.prototype.trigger = function(event, data) {
        if(!this.handlers[event]) {
            return;
        }
        for(var i = 0; i < this.handlers[event].length; i++) {
            this.handlers[event][i](data)
        }
    };

    /**
     * Adds an event handler.
     * @param {String} events the event name(s)
     * @param {Object} handler the event handler
     * @returns {undefined}
     */
    Simulator.prototype.on = function(events, handler) {
        var handlers = this.handlers;
        events.split(' ').forEach(function(event) {
            if(!handlers[event]) {
                handlers[event] = [];
            }
            handlers[event].push(handler);
        });
    };

    /**
     * Removes an event handler.
     * @param {String} events the event name(s)
     * @param {Object} handler the event handler (optional)
     * @returns {undefined}
     */
    Simulator.prototype.off = function(events, handler) {
        var handlers = this.handlers;
        events.split(' ').forEach(function(event) {
            if(typeof handler === 'undefined') {
                handlers[event] = [];
            }
            if(handlers[event]) {
                var index = handlers[event].indexOf(handler);
                if(index >= 0) {
                    handlers[event].splice(index, 1);
                }
            }
        });
    };

    /**
     * Gets an entity instance by ID.
     * @param {String} id the unique ID
     * @returns {Object} the entity
     */
    Simulator.prototype.entity = function(id) {
        for(var i = 0; i < this.entities.length; i++) {
            if(this.entities[i].id===id) {
                return this.entities[i];
            }
        }
    };

    /**
     * Gets the value of an entity by ID.
     * @param {String} id the unique ID
     * @returns {Number} the value
     */
    Simulator.prototype.value = function(id) {
        var entity = this.entity(id);
        if(typeof entity !== 'undefined') {
            return entity.getValue(this);
        }
    };

    return Simulator;
});