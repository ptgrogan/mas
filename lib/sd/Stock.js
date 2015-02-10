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
 * The Stock class represents stocks in a System Dynamics (SD) model.
 * Override the getDerivative method to specify the function to integrate.
 * The default getInitValue method accesses the initValue attribute.
 * The default integrate method uses explicit Euler integration.
 * @type Object
 */
function Stock() {
	this.initValue = 0;
	this.value = 0;
	this.nextValue = 0;
	Entity.apply(this, arguments);
};

/**
 * Inherit from Entity.
 */
Stock.prototype = new Entity();

/**
 * Gets the initial value of this stock (can override).
 * @returns {Number} the initial value
 */
Stock.prototype.getInitValue = function() {
	return this.initValue;
};

/**
 * Gets the derivative of this stock (can override).
 * @returns {Number} the derivative
 */
Stock.prototype.getDerivative = function() {
	return 0;
};

/**
 * Gets the value of this stock.
 * @returns {Number} the value
 */
Stock.prototype.getValue = function() {
	return this.value;
};

/**
 * Gets the next value of this stock.
 * @param {Number} timeStep the time step
 * @param {Object} method the integration method
 * @returns {Number} the next value
 */
Stock.prototype.getNextValue = function(timeStep, method) {
	return method.integrate(this.getValue(), 
			this.getDerivative(), timeStep);
};

/**
 * Initializes this stock at an initial time.
 * @param {Number} initTime the initial time
 * @returns {undefined}
 */
Stock.prototype.init = function(initTime) {
	this.value = this.getInitValue();
	this.nextValue = this.getInitValue();
};

/**
 * Pre-calculates the next value for this stock.
 * @param {Number} timeStep the time step
 * @param {Object} method the integration method
 * @returns {undefined}
 */
Stock.prototype.tick = function(timeStep, method) {
	this.nextValue = this.getNextValue(timeStep, method);
};

/**
 * Commits the next time for this stock.
 * @returns {undefined}
 */
Stock.prototype.tock = function() {
	this.value = this.nextValue;
};

/**
 * Expose Stock.
 */
module.exports = Stock;