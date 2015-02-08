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

var Stock = require('./Stock.js');
/** 
 * The Smooth class represents a smoothing function in a System Dynamics (SD) model.
 * Override the getInput method to specify the input function.
 * The default getInitValue method accesses the initValue attribute.
 * @type Object
 */
function Smooth() {
	this.delayTime = 1;
	
	/**
	 * Gets the input for this smoothing function (can override).
	 * @returns {Number} the input value
	 */
	this.getInput = function() {
		return 0;
	};
	
	// call superclass to override default values
	// public members above this can be overridden
	Stock.apply(this, arguments);
	// public members below this cannot be overridden
	
	/**
	 * Gets the derivative for this smoothing function.
	 * @returns {Number} the derivative
	 */
	this.getDerivative = function() {
		return (this.getInput() - this.getValue()) / this.delayTime;
	};
};

if (typeof define === "function" && define.amd) define(Smooth);
else if (typeof module === "object" && module.exports) module.exports = Smooth;
this.Smooth = Smooth;