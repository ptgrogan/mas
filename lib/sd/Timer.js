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

var Entity = require('./Entity.js');

/**
 * The Timer class extends the entity class to maintain simulation time.
 * @type Object
 */
function Timer() {
	var time = 0;
	var nextTime = 0;
	
	// call superclass to override default values
	// public members above this can be overridden
	Entity.apply(this, arguments);
	// public members below this cannot be overridden
	
	/**
	 * Gets the value of this timer.
	 * @returns {Number}
	 */
	this.getValue = function() {
		return time;
	};
	
	/**
	 * Initializes this timer at an initial time.
	 * @param {Number} initialTime the initial time
	 * @returns {undefined}
	 */
	this.init = function(initialTime) {
		time = initialTime;
		nextTime = initialTime;
	};
	
	/**
	 * Pre-calculates the next time for this timer.
	 * @param {Number} timeStep the time step
	 * @returns {undefined}
	 */
	this.tick = function(timeStep) {
		nextTime = time + timeStep;
	};
	
	/**
	 * Commits the next time for this timer.
	 * @returns {undefined}
	 */
	this.tock = function() {
		time = nextTime;
	};
};

if (typeof define === "function" && define.amd) define(Timer);
else if (typeof module === "object" && module.exports) module.exports = Timer;
this.Timer = Timer;