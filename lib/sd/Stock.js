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
 * The Stock class represents stocks in a System Dynamics (SD) model.
 * Override the getDerivative method to specify the function to integrate.
 * The default getInitValue method accesses the initValue attribute.
 * The default integrate method uses explicit Euler integration.
 * @type Object
 */
function Stock() {
	this.initValue = 0;
	var value = 0;
	var nextValue = 0;
	
	/**
	 * Gets the initial value of this stock (can override).
	 * @returns {Number} the initial value
	 */
	this.getInitValue = function() {
		return this.initValue;
	};
	
	/**
	 * Integration method for this stock (can override).
	 * @param {Number} x the initial value
	 * @param {Number} dx_dt the derivative
	 * @param {Number} dt the time step
	 * @returns {Number} the final value
	 */
	this.integrate = function(x, dx_dt, dt) {
		return integrateEuler(x, dx_dt, dt);
	};
	
	/**
	 * Gets the derivative of this stock (can override).
	 * @returns {Number} the derivative
	 */
	this.getDerivative = function() {
		return 0;
	};
	
	// call superclass to override default values
	// public members above this can be overridden
	Entity.apply(this, arguments);
	// public members below this cannot be overridden
	
	/**
	 * Gets the value of this stock.
	 * @returns {Number} the value
	 */
	this.getValue = function() {
		return value;
	};
	
	/**
	 * Gets the next value of this stock.
	 * @param {Number} timeStep the time step
	 * @returns {Number} the next value
	 */
	this.getNextValue = function(timeStep) {
		return this.integrate(this.getValue(), this.getDerivative(), timeStep);
	};
	
	/**
	 * Explicit Euler integration method.
	 * @param {Number} x the initial value
	 * @param {Number} dx_dt the derivative
	 * @param {Number} dt the time step
	 * @returns {Number} the final value
	 */
	function integrateEuler(x, dx_dt, dt) {
		return x + dx_dt * dt;
	};
	
	/**
	 * Initializes this stock at an initial time.
	 * @param {Number} initialTime the initial time
	 * @returns {undefined}
	 */
	this.init = function(initialTime) {
		value = this.getInitValue();
		nextValue = this.getInitValue();
	};
	
	/**
	 * Pre-calculates the next value for this stock.
	 * @param {Number} timeStep the time step
	 * @returns {undefined}
	 */
	this.tick = function(timeStep) {
		nextValue = this.getNextValue(timeStep);
	};
	
	/**
	 * Commits the next time for this stock.
	 * @returns {undefined}
	 */
	this.tock = function() {
		value = nextValue;
	};
};

if (typeof define === "function" && define.amd) define(Stock);
else if (typeof module === "object" && module.exports) module.exports = Stock;
this.Stock = Stock;