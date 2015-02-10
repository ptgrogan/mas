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
 
function ExplicitEuler() {
	this.name = 'euler';
}

/**
 * Explicit Euler integration method.
 * @param {Number} x the initial value
 * @param {Number} dx_dt the derivative
 * @param {Number} dt the time step
 * @returns {Number} the final value
 */
ExplicitEuler.prototype.integrate = function(x, dx_dt, dt) {
	return x + dx_dt * dt;
};

/**
 * Expose ExplicitEuler.
 */
module.exports = ExplicitEuler;