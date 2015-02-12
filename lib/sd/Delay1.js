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
    var Stock = require('sd/stock');

    /** 
     * The Delay1 class represents a first-order exponential delay function in a 
     * System Dynamics (SD) model.
     * Override the getInput method to specify the input function.
     * The default getInitValue method accesses the initValue attribute.
     * @type Object
     */
    function Delay1() {
        this.delayTime = 1;
        Stock.apply(this, arguments);
    };

    /**
     * Inherit from Stock.
     */
    Delay1.prototype = new Stock();

    /**
     * Gets the input for this delay function (can override).
     * @param {Object} sim the simulator
     * @returns {Number} the input value
     */
    Delay1.prototype.getInput = function(sim) {
        return 0;
    };

    /**
     * Gets the next value for this delay function.
     * @param {Object} sim the simulator
     * @returns {Number} the next value
     */
    Delay1.prototype.getNextValue = function(sim) {
        return sim.method.integrate(this.getValue()*this.delayTime,
                this.getDerivative(sim), sim.timeStep)/this.delayTime;
    };

    /**
     * Gets the derivative for this delay function.
     * @param {Object} sim the simulator
     * @returns {Number} the derivative
     */
    Delay1.prototype.getDerivative = function(sim) {
        return this.getInput(sim) - this.getValue();
    };

    return Delay1;
});