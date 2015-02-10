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

var mas = require("../lib/mas");
var Utils = new mas.util.Utils();

var isrm = function() {
	this.name = 'isrm';
	this.version = '0.4.1';
	this.params = {};
	this.params.schPressure = 1.5;
	this.params.cogBandwidth = 5;
	this.params.metaFlag = 1;
	this.params.changeFlag = 1;
	this.params.designSpeed = 0.25;
	this.params.modIntegrity = 0.8;
	this.params.reStaffRatio = 10;
	this.params.vvStaffRatio = 20;
	this.params.cgStaffRatio = 4;
	this.params.ceStaffRatio = 1000;
	this.params.aveLaborRate = 20000
	this.params.modCoverage = 0.5;
	this.params.fracChangeReq = 0.2;
	this.params.fracProblemsCaught = 0.7;
	this.params.archThroughput = 50;
	
	// override default parameter values
	for(var n in arguments[0]) {
		this.params[n] = arguments[0][n];
	}
	
	this.entities = [
		new mas.sd.Parameter({
			id: 'schPressure', 
			name: "Schedule Pressure", 
			desc: "Multiplier for speed of several processes.",
			value: this.params.schPressure
		}),
		new mas.sd.Parameter({
			id: 'cogBandwidth', 
			name: 'Cognitive Bandwidth',
			desc: "Constraint on the project team's ability to " +
					"consider multiple concepts at the same time.",
			units: "Reqs", 
			value: this.params.cogBandwidth
		}),
		new mas.sd.Parameter({
			id: 'metaFlag', 
			name: "META Flag", 
			desc: "Boolean to set META processes on (1) or off (0).",
			value: this.params.metaFlag
		}),
		new mas.sd.Parameter({
			id: 'changeFlag', 
			name: "Change Flag", 
			desc: "Boolean to set change generation on (1) or off (0).",
			value: this.params.changeFlag
		}),
		new mas.sd.Parameter({
			id: 'designSpeed', 
			name: "Design Speed", 
			desc: "Multiplier to set the rate of design activities.",
			value: this.params.designSpeed
		}),
		new mas.sd.Parameter({
			id: 'modIntegrity', 
			name: "Component Model Library Integrity", 
			desc: "Fraction of the component model library free of errors.",
			value: this.params.modIntegrity
		}),
		new mas.sd.Parameter({
			id: 'reStaffRatio', 
			name: "RE Staff Ratio", 
			desc: "Productivity of requirements engineering staff.",
			units: "Reqs/Person-Month", 
			value: this.params.reStaffRatio
		}),
		new mas.sd.Parameter({
			id: 'vvStaffRatio', 
			name: "VV Staff Ratio", 
			desc: "Productivity of verification and validation staff.",
			units: "Tests/Person-Month", 
			value: this.params.vvStaffRatio
		}),
		new mas.sd.Parameter({
			id: 'cgStaffRatio', 
			name: "CG Staff Ratio", 
			desc: "Productivity of change generation staff.",
			units: "Changes/Person-Month", 
			value: this.params.cgStaffRatio
		}),
		new mas.sd.Parameter({
			id: 'ceStaffRatio', 
			name: "CE Staff Ratio", 
			desc: "Productivity of concept exploration staff.",
			units: "Archs/Person-Month",
			value: this.params.ceStaffRatio
		}),
		new mas.sd.Parameter({
			id: 'aveLaborRate', 
			name: "Average Labor Rate", 
			desc: "Mean labor cost across the project team.",
			value: this.params.aveLaborRate
		}),
		new mas.sd.Parameter({
			id: 'modCoverage', 
			desc: "Fraction of component models already existing in the library.",
			name: "Component Model Library Coverage", 
			value: this.params.modCoverage
		}),
		new mas.sd.Parameter({
			id: 'fracChangeReq', 
			desc: "Fraction of changes which generate new requirements.",
			name: "Fraction of Changes that affect Requirements",
			value: this.params.fracChangeReq
		}),
		new mas.sd.Parameter({
			id: 'fracProblemsCaught', 
			desc: "Fraction of changes caught during design, verification, " +
					"and validation to avoid generation of changes.",
			name: "Fraction of Problems Caught Initially",
			value: this.params.fracProblemsCaught
		}),
		new mas.sd.Parameter({
			id: 'archThroughput', 
			name: "Architecture Enumeration Throughput", 
			desc: "Rate of potential architecture generation.",
			units: "Archs/Month",
			value: this.params.archThroughput
		}),
		new mas.sd.Flow({
			id: 'initReq', 
			name: "Initial Requirements", 
			desc: "Initial rate of requirements generation from " + 
					"design activities shaped by schedule pressure " +
					"and project time.",
			units: "Reqs/Month",
			getValue: function(sim){
				return Math.max(0, -Math.pow(2*sim.value("schPressure")
						*sim.time - 10/sim.value("schPressure"), 2)
						+ sim.value("schPressure")*300);
			}
		}),
		new mas.sd.Flow({
			id: 'changeReq', 
			name: "Change Requirements", 
			desc: "Rate of requirements generation due to change implementation.",
			units: "Reqs/Month",
			getValue: function(sim) {
				return sim.value("fracChangeReq")*sim.value("changeImpl"); 
			}
		}),
		new mas.sd.Flow({
			id: 'reqElicit', 
			name: "Requirements Elicitation", 
			desc: "Rate of requirements generation including initial and change components.",
			units: "Reqs/Month",
			getValue: function(sim) {
				return sim.value("initReq")+sim.value("changeReq"); 
			}
		}),
		new mas.sd.Flow({
			id: 'levAbstraction', 
			name: "Level of Abstraction",
			desc: "Level of abstraction for design activities. Non-META " +
					"operates at a single level of abstraction. META allows " +
					"preliminary work at other levels of abstraction " +
					"determined by the number of requirements and " +
					"cognitive bandwidth of the team.",
			getValue: function(sim) {
				if(sim.value("metaFlag")===1) { 
					return Utils.intPart(Math.log(sim.value("reqDefined") + 1) 
							/ Math.log(sim.value("cogBandwidth"))); 
				} else { 
					return 1; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'conSwitch', 
			name: "Concept Switch",
			desc: "Boolean to turn concept exploration on (1) or off (0). " +
					"Concept exploration is always allowed at higher levels " +
					"of abstraction and is also allowed under low levels of " +
					"requirements elicitation.",
			getValue: function(sim) {
				if(sim.value("levAbstraction") > 1 
						|| sim.value("reqElicit") < 10) { 
					return 1; 
				} else { 
					return 0;
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'conExploration', 
			name: "Concept Exploration", 
			desc: "Realized exploration rate of potential architectures. " +
					"Exploration is limited by the maximum exploration rate " +
					"and the architecture enumeration throughput. Schedule " +
					"pressure acts as a multiplier for concept exploration.",
			units: "Archs/Month",
			getValue: function(sim) {
				return sim.value("schPressure")*Math.min(sim.value("conSwitch")
						*sim.value("explorationRate"), sim.value("conSwitch")
						*sim.value("archThroughput")); 
			}
		}),
		new mas.sd.Flow({
			id: 'explorationRate', 
			name: "Exploration Rate", 
			desc: "Maximum exploration rate of potential architectures. " +
					"META explores at a rate geometrically proportional to " +
					"the level of abstraction and inversely proportional " +
					"to the time and number of architectures retained. " +
					"Non-META explores at a fixed rate and stops when one " +
					"architecture is retained.",
			units: "Archs/Month",
			getValue: function(sim) {
				if(sim.value("metaFlag")===1) { 
					return (Math.exp(sim.value("levAbstraction"))*10) 
							/ ((0.1*sim.time + 1)
								*(sim.value("archRetained") + 1)); 
				} else if(sim.value("archRetained") > 1) { 
					return 0;
				} else { 
					return 10; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'designSwitch', 
			name: "Design Switch",
			desc: "Boolean to turn design and integration on (1) or off (0). " +
					"Design is allowed at higher levels of abstraction or " +
					"if concept exploration ends with at least one " +
					"retained architecture.",
			getValue: function(sim) {
				if(sim.value("levAbstraction") > 1 
						|| sim.value("conExploration") === 0 
						&& sim.value("archRetained") > 1) { 
					return 1; 
				} else { 
					return 0;
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'strComplexity', 
			name: "Structural Complexity",
			desc: "Measure of structural complexity for the current design. " +
					"Complexity is proportional to number of requirements " +
					"and inverse-log of the number of architectures " +
					"explored (elegance through exploration).",
			getValue: function(){ 
				return sim.value("reqDefined")/(Math.log(Math.sqrt(
						sim.value("archExplored")) + 10)/Math.LN10); 
			}
		}),
		new mas.sd.Flow({
			id: 'productivity', 
			name: "Productivity",
			desc: "Multiplier for the productivity of workers. Decreases " +
					"with increasing novelty, proportional to requirements " +
					"defined, and inversely proportional to complexity.",
			getValue: function(sim) {
				return (-0.25*(sim.value("novelty") - 1) + 0.75)
						*Math.min(0.5, 0.5*sim.value("reqDefined")
							/(sim.value("strComplexity") + 1)); 
			}
		}),
		new mas.sd.Flow({
			id: 'designIntegration', 
			name: "Design and Integration", 
			desc: "Rate of design and integration specification. Proportional " +
					"to schedule pressure. Specifications come from requirements " +
					"(proportional to design speed, productivity, and " +
					"fraction of unspecified requirements and inversely " +
					"proportional to novelty) or change implementation.",
			units: "Specs/Month",
			getValue: function(sim) {
				return sim.value("schPressure")*(sim.value("designSpeed")
						*sim.value("productivity")*(sim.value("designSwitch")
							*(1/(1-sim.value("modCoverage")))
								*Math.sqrt((sim.value("systemSpecs") + 1)
									*Math.max(0, (sim.value("reqDefined") 
										- sim.value("systemSpecs")))))
						+ (1 - sim.value("fracChangeReq"))
							*sim.value("changeImpl")); 
			}
		}),
		new mas.sd.Flow({
			id: 'novelty', 
			name: "Novelty",
			desc: "Fraction of new components.",
			getValue: function(sim) {
				return 1 - sim.value("modCoverage"); 
			}
		}),
		new mas.sd.Flow({
			id: 'archFiltering', 
			name: "Architecture Filtering", 
			desc: "Rate to filter out unwanted architectures.",
			units: "Archs/Month",
			getValue: function(sim) {
				if(sim.value("archRetained") <= 1) { 
					return 0; 
				} else {
					return sim.value("archFilteringDelay1a"); 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'testSwitch', 
			name: "Test Switch",
			desc: "Boolean to turn testing on (1) or off (0).",
			getValue: function(sim) {
				if(sim.value("levAbstraction") > 1 
						|| sim.value("designIntegration") < 10) { 
					return 1; 
				} else { 
					return 0;
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'verification', 
			name: "Verification", 
			desc: "Rate of specification tests. Proportional to schedule " +
					"pressure and productivity.",
			units: "Tests/Month",
			getValue: function(sim) {
				if(sim.value("testsPerformed") < sim.value("systemSpecs")) { 
					return sim.value("schPressure")*sim.value("testSwitch")
							*(sim.value("productivity")
								*Math.sqrt((sim.value("testsPerformed") + 1)
									*(sim.value("systemSpecs") 
									- sim.value("testsPerformed")))); 
				} else { 
					return sim.value("schPressure")*0; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'changeGen',  
			units: "Changes/Month",
			name: "Change Generation", 
			desc: "Rate of change generation.",
			getValue: function(sim) {
				if(sim.value("metaFlag")===1) { 
					return sim.value("changeFlag")
							*(Math.max((sim.value("reqDefined") 
								+ 1 - sim.value("reqValidated"))
								/(sim.value("reqDefined") + 1), 0))
							*sim.value("changeGenDelay1a")
							*(sim.value("novelty")+0.5); 
				} else { 
					return sim.value("changeFlag")
							*(Math.max((sim.value("reqDefined") 
								+ 1 - sim.value("reqValidated"))
								/(sim.value("reqDefined") + 1), 0))
							*sim.value("changeGenDelay1a")*1; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'changeImpl', 
			name: "Change Implementation", 
			desc: "Rate of changes implemented.",
			units: "Changes/Month",
			getValue: function(sim) {
				return sim.value("changeImplSmootha"); 
			}
		}),
		new mas.sd.Flow({
			id: 'validationSwitch',  
			name: "Validation Switch",
			desc: "Boolean to turn validation on (1) or off (0).",
			getValue: function(sim) {
				if(sim.value("levAbstraction") > 1 
						|| sim.value("verification") < 10) { 
					return 1; 
				} else { 
					return 0; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'validation', 
			name: "Validation", 
			desc: "Rate of requirements validation. Proportional to schedule " +
					"pressure and productivity.",
			units: "Reqs/Month",
			getValue: function(sim) {
				if(sim.value("reqValidated") 
						< sim.value("testsPerformed")) { 
					return sim.value("schPressure")
							*(sim.value("validationSwitch")
							*(sim.value("productivity")
							*Math.sqrt((sim.value("reqValidated") + 1)
								*(sim.value("testsPerformed") 
								- sim.value("reqValidated"))))); 
				} else { 
					return sim.value("schPressure")*0; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'certCompletion', 
			name: "Certificate of Completion",
			desc: "Number of certificates of completion issued.",
			getValue: function(sim) {
				if(sim.value("reqValidated") > 0.999*sim.value("reqDefined") 
						&& sim.value("pendChanges") < 1) { 
					return 1; 
				} else { 
					return 0;
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'diStaffRatio', 
			name: "DI Staff Ratio", 
			desc: "Productivity of design and integration staff.",
			units: "Parts/Person-Month",
			getValue: function(sim) {
				return 4/sim.value("novelty"); 
			}
		}),
		new mas.sd.Flow({
			id: 'sysEngineers', 
			name: "System Engineers", 
			desc: "Number of system engineers.",
			units: "People",
			getValue: function(sim) {
				return Utils.intPart((sim.value("conExploration")
							/sim.value("ceStaffRatio")) 
						+ (sim.value("reqElicit")/sim.value("reStaffRatio"))); 
			}
		}),
		new mas.sd.Flow({
			id: 'designers', 
			name: "Designers", 
			desc: "Number of designers.",
			units: "People",
			getValue: function(sim) {
				return Utils.intPart((sim.value("designIntegration")
							/sim.value("diStaffRatio")) 
						+ (sim.value("changeGen")/sim.value("cgStaffRatio"))); 
			}
		}),
		new mas.sd.Flow({
			id: 'testers', 
			name: "Testers", 
			desc: "Number of testers.",
			units: "People",
			getValue: function(sim) {
				return Utils.intPart((sim.value("validation") 
						+ sim.value("verification"))/sim.value("vvStaffRatio")); 
			}
		}),
		new mas.sd.Flow({
			id: 'spendRate', 
			name: "Spending Rate", 
			desc: "Rate of spending money.",
			units: "$/Month",
			getValue: function(sim) {
				return (sim.value("sysEngineers") + sim.value("designers") 
						+ sim.value("testers")) * sim.value("aveLaborRate"); 
			}
		}),
		new mas.sd.Stock({
			id: 'reqDefined', 
			name: "Requirements Defined", 
			desc: "Number of requirements defined.",
			units: "Reqs",
			getDerivative: function(sim) { 
				return sim.value("reqElicit"); 
			}
		}),
		new mas.sd.Stock({
			id: 'archExplored', 
			name: "Architectures Explored", 
			desc: "Number of architectures explored.",
			units: "Archs",
			getDerivative: function(sim) { 
				return Utils.intPart(sim.value("conExploration")); 
			}
		}),
		new mas.sd.Stock({
			id: 'archRetained',  
			name: "Architectures Retained", 
			desc: "Number of architectures retained.",
			units: "Archs",
			getDerivative: function(sim) { 
				return Utils.intPart(sim.value("conExploration") 
						- sim.value("archFiltering")); 
			}
		}),
		new mas.sd.Stock({
			id: 'systemSpecs',
			name: "System Specifications", 
			desc: "Number of system specifications generated.",
			units: "Specs", 
			getDerivative: function(sim) { 
				return sim.value("designIntegration"); 
			}
		}),
		new mas.sd.Stock({
			id: 'testsPerformed', 
			name: "Tests Performed", 
			desc: "Number of specifications tested.",
			units: "Tests",
			getDerivative: function(sim) { 
				return sim.value("verification"); 
			}
		}),
		new mas.sd.Stock({
			id: 'pendChanges', 
			name: "Pending Changes", 
			desc: "Number of changes pending completion.",
			units: "Changes",
			getDerivative: function(sim) { 
				return sim.value("changeGen") - sim.value("changeImpl"); 
			}
		}),
		new mas.sd.Stock({
			id: 'cumChanges', 
			name: "Cumulative Changes", 
			desc: "Number of changes generated.",
			units: "Changes",
			getDerivative: function(sim) { 
				return sim.value("changeGen"); 
			}
		}),
		new mas.sd.Stock({
			id: 'reqValidated', 
			name: "Requirements Validated", 
			desc: "Number of requirements validated.",
			units: "Reqs",
			getDerivative: function(sim) { 
				return sim.value("validation"); 
			}
		}),
		new mas.sd.Stock({
			id: 'nreCost', 
			name: "NRE Cost", 
			desc: "Non-recurring engineering cost.",
			units: "$",
			getDerivative: function(sim) { 
				return sim.value("spendRate"); 
			}
		}),
		new mas.sd.Stock({
			id: 'projDuration', 
			name: "Project Duration", 
			desc: "Duration until certificate of completion is achieved.",
			units: "Months",
			getDerivative: function(sim) { 
				return 1 - sim.value("certCompletion"); 
			}
		}),
		new mas.sd.Smooth({
			id: 'changeImplSmootha', 
			delayTime: 1, 
			initValue: 1, 
			getInput: function(sim){ 
				return sim.value("changeImplDelay1a"); 
			}
		}),
		new mas.sd.Delay1({
			id: 'archFilteringDelay1a', 
			delayTime: 1, 
			getInput: function(sim) { 
				return sim.value("conExploration"); 
			}
		}),
		new mas.sd.Delay1({
			id: 'changeGenDelay1a', 
			delayTime: 1, 
			getInput: function(sim) { 
				return (sim.value("strComplexity")/(sim.value("reqDefined") + 1))
						*((1 - sim.value("fracProblemsCaught"))
							*sim.value("verification") 
						+ (1 - sim.value("fracProblemsCaught"))
							*sim.value("validation") 
						+ (1 - sim.value("fracProblemsCaught"))
							*sim.value("designIntegration") 
						+ sim.value("changeGenDelay1b")); 
			}
		}),
		new mas.sd.Delay1({
			id: 'changeGenDelay1b', 
			delayTime: 4, 
			initValue:0.12, 
			getInitValue: function(sim) {
				return this.getInput(sim);
			}, getInput: function(sim) { 
				return sim.value("metaFlag")*sim.value("novelty")
						*(1 - sim.value("modIntegrity"))
						*sim.value("designIntegration"); 
			}
		}),
		new mas.sd.Delay1({
			id: 'changeImplDelay1a', 
			delayTime: 0.5, 
			getInput: function(sim) { 
				return sim.value("changeGen"); 
			}
		}),
	];
}

var model = new isrm();

var sim = new mas.sim.LoggingSimulator({
	entities: model.entities,
	initTime: 0,
	timeStep: 0.25,
	maxTime: 30
});
sim.on('init advance', function(time) {
	console.log(time + ' ' + sim.value('nreCost'));
});
sim.execute();
console.log(JSON.stringify(sim));