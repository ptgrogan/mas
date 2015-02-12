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
    var Entity = require('../sim/entity');

    /** 
     * The Flow class represents a flow in a System Dynamics (SD) model.
     * Override the getValue method to specify the value function.
     * @type Object
     */
    function Flow() {
        Entity.apply(this, arguments);
    };

    /**
     * Inherit from Entity.
     */
    Flow.prototype = new Entity();

    /**
     * Gets the value of this flow.
     * @param {Object} sim the simulator
     * @returns {Number} the value
     */
    Flow.prototype.getValue = function(sim) {
        return 0;
    };

    return Flow;
});