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
	mas.util.Utils = require("./util/Utils.js");
	
	mas.sd = {};
	mas.sd.Delay1 = require("./sd/Delay1.js");
	mas.sd.Entity = require("./sd/Entity.js");
	mas.sd.Flow = require("./sd/Flow.js");
	mas.sd.LoggingSimulator = require("./sd/LoggingSimulator.js");
	mas.sd.Parameter = require("./sd/Parameter.js");
	mas.sd.Simulator = require("./sd/Simulator.js");
	mas.sd.Smooth = require("./sd/Smooth.js");
	mas.sd.Stock = require("./sd/Stock.js");
	mas.sd.Timer = require("./sd/Timer.js");
	
	if (typeof define === "function" && define.amd) define(mas);
	else if (typeof module === "object" && module.exports) module.exports = mas;
	this.mas = mas;
}();