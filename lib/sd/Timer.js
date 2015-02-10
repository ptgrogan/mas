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

var Entity = require('../sim/entity');

/**
 * The Timer class extends the entity class to maintain simulation time.
 * @type Object
 */
function Timer() {
	this.time = 0;
	this.nextTime = 0;
	Entity.apply(this, arguments);
};

/**
 * Inherit from Entity.
 */
Timer.prototype = new Entity();

/**
 * Gets the value of this timer.
 * @returns {Number}
 */
Timer.prototype.getValue = function() {
	return this.time;
};

/**
 * Initializes this timer at an initial time.
 * @param {Number} initTime the initial time
 * @returns {undefined}
 */
Timer.prototype.init = function(initTime) {
	this.time = initTime;
	this.nextTime = initTime;
};

/**
 * Pre-calculates the next time for this timer.
 * @param {Number} timeStep the time step
 * @returns {undefined}
 */
Timer.prototype.tick = function(timeStep) {
	this.nextTime = this.time + timeStep;
};

/**
 * Commits the next time for this timer.
 * @returns {undefined}
 */
Timer.prototype.tock = function() {
	this.time = this.nextTime;
};

/**
 * Expose Timer.
 */
module.exports = Timer;