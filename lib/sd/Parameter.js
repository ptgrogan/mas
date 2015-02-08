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
 * The Parameter class represents a constant-valued flow in a System Dynamics 
 * (SD) model.
 * @type Object
 */
function Parameter() {
	this.value = 0;
	
	/**
	 * Gets the value of this parameter.
	 * @returns {Number} the value
	 */
	this.getValue = function() {
		return this.value;
	};
	
	// call superclass to override default values
	// public members above this can be overridden
	Entity.apply(this, arguments);
	// public members below this cannot be overridden
};

if (typeof define === "function" && define.amd) define(Parameter);
else if (typeof module === "object" && module.exports) module.exports = Parameter;
this.Parameter = Parameter;