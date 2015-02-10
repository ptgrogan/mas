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
 * The Parameter class represents a constant-valued flow in a System Dynamics 
 * (SD) model.
 * @type Object
 */
function Parameter() {
	this.value = 0;
	Entity.apply(this, arguments);
};

/**
 * Inherit from Entity.
 */
Parameter.prototype = new Entity();

/**
 * Gets the value of this parameter.
 * @returns {Number} the value
 */
Parameter.prototype.getValue = function() {
	return this.value;
};

/**
 * Expose Parameter.
 */
module.exports = Parameter;