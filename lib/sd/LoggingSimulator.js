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

var Simulator = require('./Simulator.js');

/** 
 * The LoggingSimulator class extends the base Simulator class with logging.
 * @type Object
 */
function LoggingSimulator() {
	// call superclass to override default values
	// public members above this can be overridden
	Simulator.apply(this, arguments);
	// public members below this cannot be overridden
	
	var sim = this;
	this.log = {};
	
	// add a handler to log initial values
	this.on('init', function(time) {
		for(var i = 0; i < sim.entities.length; i++) {
			sim.log[sim.entities[i].id] = [];
			sim.log[sim.entities[i].id].push(sim.entities[i].getValue());
		}
	});
	
	// add a handler to log values at each time step
	this.on('advance', function(time) {
		for(var i = 0; i < sim.entities.length; i++) {
			sim.log[sim.entities[i].id].push(sim.entities[i].getValue());
		}
	});
}

if (typeof define === "function" && define.amd) define(LoggingSimulator);
else if (typeof module === "object" && module.exports) module.exports = LoggingSimulator;
this.LoggingSimulator = LoggingSimulator;