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
    var Utils = new (require('../util/utils'))();

    /**
     * The Entity class is the basis for all simulation objects. It provides 
     * methods to initialize and advance (tick/tock) an entity in simulated time.
     * @type Object
     */
    function Entity() {
        this.id = Utils.guid();
        // override default attributes or methods
        for(var n in arguments[0]) {
            this[n] = arguments[0][n];
        }
    };

    /**
     * Initializes this entity at an initial time.
     * @param {Object} sim the simulator
     * @returns {undefined}
     */
    Entity.prototype.init = function(sim) {};

    /**
     * Pre-calculates state changes for this entity over a time step duration.
     * @param {Object} sim the simulator
     * @returns {undefined}
     */
    Entity.prototype.tick = function(sim) {};

    /**
     * Commits pre-calculated state changes for this entity.
     * @returns {undefined}
     */
    Entity.prototype.tock = function() {};

    return Entity;
});