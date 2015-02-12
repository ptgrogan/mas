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
    var Simulator = require('./simulator');

    /** 
     * The LoggingSimulator class extends the base Simulator class with logging.
     * @type Object
     */
    function LoggingSimulator() {
        this.log = {};
        Simulator.apply(this, arguments);
        var sim = this;
        // add a handler to log initial values
        this.on('init', function(time) {
            sim.log.time = [];
            sim.log.time.push(sim.time);
            for(var i = 0; i < sim.entities.length; i++) {
                var id = sim.entities[i].id;
                sim.log[id] = [];
                sim.log[id].push(sim.value(id));
            }
        });
        // add a handler to log values at each time step
        this.on('advance', function(time) {
            sim.log.time.push(sim.time);
            for(var i = 0; i < sim.entities.length; i++) {
                var id = sim.entities[i].id;
                sim.log[id].push(sim.value(id));
            }
        });
    }

    /**
     * Inherit from Simulator.
     */
    LoggingSimulator.prototype = new Simulator();

    return LoggingSimulator;
});