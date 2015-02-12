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
    var mas = {version: "0.0.1"};

    mas.util = {};
    mas.util.Utils = require('./util/utils');

    mas.sim = {};
    mas.sim.Entity = require('./sim/entity');
    mas.sim.ExplicitEuler = require('./sim/explicitEuler');
    mas.sim.Simulator = require('./sim/simulator');
    mas.sim.LoggingSimulator = require('./sim/loggingSimulator');

    mas.sd = {};
    mas.sd.Delay1 = require('./sd/delay1');
    mas.sd.Flow = require('./sd/flow');
    mas.sd.Parameter = require('./sd/parameter');
    mas.sd.Smooth = require('./sd/smooth');
    mas.sd.Stock = require('./sd/stock');

    return mas;
});