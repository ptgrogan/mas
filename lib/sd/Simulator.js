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

/** 
 * The Simulator class executes a simulation of entities with events:
 *  - init: triggered after simulation execution is initialized 
 *  - advance: triggered after simulation execution is advanced by a time step
 *  - complete: triggered after simulation execution is complete
 * Override the isComplete method to specify alternate ending conditions.
 * @type Object
 */
function Simulator() {
	var time = 0;
	var handlers = new Array();
	this.entities = new Array();
	this.initTime = 0;
	this.maxTime = 1;
	this.timeStep = 1;
	
	/**
	 * Checks whether the simulation execution is complete (can override).
	 * @returns {Boolean}
	 */
	this.isComplete = function() {
		return time >= this.maxTime;
	};
	
	// override default values
	// public members above this can be overridden
	for(var n in arguments[0]) {
		this[n] = arguments[0][n];
	}
	// public members below this cannot be overridden
	
	/**
	 * Executes this simulation as fast as possible. Initializes at an initial
	 * time and advances with time step duration until complete.
	 * @returns {undefined}
	 */
	this.execute = function() {
		this.init();
		while(!this.isComplete()) {
			this.advance();
		}
	};

	/**
	 * Initializes this simulation to an initial time.
	 * @returns {undefined}
	 */
	this.init = function() {
		var numEntities = this.entities.length; // cached to improve performance
		for(var i = 0; i < numEntities; i++) {
			this.entities[i].init(this.initTime);
		}
		time = this.initTime;
		trigger("init", time);
	};

	/**
	 * Advances this simulation by a time step.
	 * @returns {undefined}
	 */
	this.advance = function() {
		if(this.isComplete()) {
			return;
		}
		var numEntities = this.entities.length; // cached to improve performance
		for(var i = 0; i < numEntities; i++) {
			this.entities[i].tick(this.timeStep);
		}
		for(var i = 0; i < numEntities; i++) {
			this.entities[i].tock();
		}
		time += this.timeStep;
		trigger("advance", time);
		if(this.isComplete()) {
			trigger("complete", time);
		}
	};

	/**
	 * Triggers an event with data.
	 * @param {String} event the event name
	 * @param {Object} data the event data
	 * @returns {undefined}
	 */
	function trigger(event, data) {
		if(!handlers[event]) {
			return;
		}
		for(var i = 0; i < handlers[event].length; i++) {
			handlers[event][i](data)
		}
	};

	/**
	 * Adds an event handler.
	 * @param {String} events the event name(s)
	 * @param {Object} handler the event handler
	 * @returns {undefined}
	 */
	this.on = function(events, handler) {
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
	this.off = function(events, handler) {
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
};
if (typeof define === "function" && define.amd) define(Simulator);
else if (typeof module === "object" && module.exports) module.exports = Simulator;
this.Simulator = Simulator;