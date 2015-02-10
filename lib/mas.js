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

!function(){
	var mas = {version: "0.0.1"};
	
	mas.util = {};
	mas.util.Utils = require("./util/utils.js");
	
	mas.sim = {};
	mas.sim.Entity = require("./sim/entity.js");
	mas.sim.ExplicitEuler = require("./sim/explicitEuler.js");
	mas.sim.Simulator = require("./sim/simulator.js");
	mas.sim.LoggingSimulator = require("./sim/loggingSimulator.js");
	
	mas.sd = {};
	mas.sd.Delay1 = require("./sd/delay1.js");
	mas.sd.Flow = require("./sd/flow.js");
	mas.sd.Parameter = require("./sd/parameter.js");
	mas.sd.Smooth = require("./sd/smooth.js");
	mas.sd.Stock = require("./sd/stock.js");
	mas.sd.Timer = require("./sd/timer.js");
	
	if (typeof define === "function" && define.amd) define(mas);
	else if (typeof module === "object" && module.exports) module.exports = mas;
	this.mas = mas;
}();