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

var Utils = new (require('../util/Utils.js'))();

/**
 * The Entity class is the basis for all simulation objects. It provides 
 * methods to initialize and advance (tick/tock) an entity in simulated time.
 * @type Object
 */
function Entity() {
	this.id = Utils.guid();
	
	// override default values
	// public members above this can be overridden
	for(var n in arguments[0]) {
		this[n] = arguments[0][n];
	}
	// public members below this cannot be overridden
	
	/**
	 * Initializes this entity at an initial time.
	 * @param {Number} initialTime
	 * @returns {undefined}
	 */
	this.init = function(initialTime) {};
	
	/**
	 * Pre-calculates state changes for this entity over a time step duration.
	 * @param {Number} timeStep
	 * @returns {undefined}
	 */
	this.tick = function(timeStep) {};
	
	/**
	 * Commits pre-calculated state changes for this entity.
	 * @returns {undefined}
	 */
	this.tock = function() {};
};

if (typeof define === "function" && define.amd) define(Entity);
else if (typeof module === "object" && module.exports) module.exports = Entity;
this.Entity = Entity;