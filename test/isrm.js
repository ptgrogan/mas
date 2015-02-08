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
	
	var model = this;
	this.entities = [
		new mas.sd.Timer({
			id: 'time',
			name: 'Time'
		}),
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
			getValue: function(){
				return Math.max(0, -Math.pow(2*model.value("schPressure")
						*model.value("time") - 10/model.value("schPressure"), 2)
						+ model.value("schPressure")*300);
			}
		}),
		new mas.sd.Flow({
			id: 'changeReq', 
			name: "Change Requirements", 
			desc: "Rate of requirements generation due to change implementation.",
			units: "Reqs/Month",
			getValue: function() { 
				return model.value("fracChangeReq")*model.value("changeImpl"); 
			}
		}),
		new mas.sd.Flow({
			id: 'reqElicit', 
			name: "Requirements Elicitation", 
			desc: "Rate of requirements generation including initial and change components.",
			units: "Reqs/Month",
			getValue: function() { 
				return model.value("initReq")+model.value("changeReq"); 
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
			getValue: function() { 
				if(model.value("metaFlag")===1) { 
					return Utils.intPart(Math.log(model.value("reqDefined") + 1) 
							/ Math.log(model.value("cogBandwidth"))); 
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
			getValue: function() { 
				if(model.value("levAbstraction") > 1 
						|| model.value("reqElicit") < 10) { 
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
					"pressure acts as a multipler for concept exploration.",
			units: "Archs/Month",
			getValue: function() { 
				return model.value("schPressure")*Math.min(model.value("conSwitch")
						*model.value("explorationRate"), model.value("conSwitch")
						*model.value("archThroughput")); 
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
			getValue: function() { 
				if(model.value("metaFlag")===1) { 
					return (Math.exp(model.value("levAbstraction"))*10) 
							/ ((0.1*model.value("time") + 1)
								*(model.value("archRetained") + 1)); 
				} else if(model.value("archRetained") > 1) { 
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
			getValue: function() { 
				if(model.value("levAbstraction") > 1 
						|| model.value("conExploration") === 0 
						&& model.value("archRetained") > 1) { 
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
				return model.value("reqDefined")/(Math.log(Math.sqrt(
						model.value("archExplored")) + 10)/Math.LN10); 
			}
		}),
		new mas.sd.Flow({
			id: 'productivity', 
			name: "Productivity",
			desc: "Multiplier for the productivity of workers. Decreases " +
					"with increasing novelty, proportional to requirements " +
					"defined, and inversely proporational to complexity.",
			getValue: function() { 
				return (-0.25*(model.value("novelty") - 1) + 0.75)
						*Math.min(0.5, 0.5*model.value("reqDefined")
							/(model.value("strComplexity") + 1)); 
			}
		}),
		new mas.sd.Flow({
			id: 'designIntegration', 
			name: "Design and Integration", 
			desc: "Rate of design and integration specification. Proportional " +
					"to schedule pressure. Specifications come from requirements " +
					"(proporational to design speed, productivity, and " +
					"fraction of unspecified requirements and inversely " +
					"proportional to novelty) or change implementation.",
			units: "Specs/Month",
			getValue: function() { 
				return model.value("schPressure")*(model.value("designSpeed")
						*model.value("productivity")*(model.value("designSwitch")
							*(1/(1-model.value("modCoverage")))
								*Math.sqrt((model.value("systemSpecs") + 1)
									*Math.max(0, (model.value("reqDefined") 
										- model.value("systemSpecs")))))
						+ (1 - model.value("fracChangeReq"))
							*model.value("changeImpl")); 
			}
		}),
		new mas.sd.Flow({
			id: 'novelty', 
			name: "Novelty",
			desc: "Fraction of new components.",
			getValue: function() { 
				return 1 - model.value("modCoverage"); 
			}
		}),
		new mas.sd.Flow({
			id: 'archFiltering', 
			name: "Architecture Filtering", 
			desc: "Rate to filter out unwanted architectures.",
			units: "Archs/Month",
			getValue: function() { 
				if(model.value("archRetained") <= 1) { 
					return 0; 
				} else {
					return model.value("archFilteringDelay1a"); 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'testSwitch', 
			name: "Test Switch",
			desc: "Boolean to turn testing on (1) or off (0).",
			getValue: function() { 
				if(model.value("levAbstraction") > 1 
						|| model.value("designIntegration") < 10) { 
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
			getValue: function() { 
				if(model.value("testsPerformed") < model.value("systemSpecs")) { 
					return model.value("schPressure")*model.value("testSwitch")
							*(model.value("productivity")
								*Math.sqrt((model.value("testsPerformed") + 1)
									*(model.value("systemSpecs") 
									- model.value("testsPerformed")))); 
				} else { 
					return model.value("schPressure")*0; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'changeGen',  
			units: "Changes/Month",
			name: "Change Generation", 
			desc: "Rate of change generation.",
			getValue: function() { 
				if(model.value("metaFlag")===1) { 
					return model.value("changeFlag")
							*(Math.max((model.value("reqDefined") 
								+ 1 - model.value("reqValidated"))
								/(model.value("reqDefined") + 1), 0))
							*model.value("changeGenDelay1a")
							*(model.value("novelty")+0.5); 
				} else { 
					return model.value("changeFlag")
							*(Math.max((model.value("reqDefined") 
								+ 1 - model.value("reqValidated"))
								/(model.value("reqDefined") + 1), 0))
							*model.value("changeGenDelay1a")*1; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'changeImpl', 
			name: "Change Implementation", 
			desc: "Rate of changes implemented.",
			units: "Changes/Month",
			getValue: function() { 
				return model.value("changeImplSmootha"); 
			}
		}),
		new mas.sd.Flow({
			id: 'validationSwitch',  
			name: "Validation Switch",
			desc: "Boolean to turn validation on (1) or off (0).",
			getValue: function() { 
				if(model.value("levAbstraction") > 1 
						|| model.value("verification") < 10) { 
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
			getValue: function() { 
				if(model.value("reqValidated") 
						< model.value("testsPerformed")) { 
					return model.value("schPressure")
							*(model.value("validationSwitch")
							*(model.value("productivity")
							*Math.sqrt((model.value("reqValidated") + 1)
								*(model.value("testsPerformed") 
								- model.value("reqValidated"))))); 
				} else { 
					return model.value("schPressure")*0; 
				} 
			}
		}),
		new mas.sd.Flow({
			id: 'certCompletion', 
			name: "Certificate of Completion",
			desc: "Number of certificates of completion issued.",
			getValue: function() { 
				if(model.value("reqValidated") > 0.999*model.value("reqDefined") 
						&& model.value("pendChanges") < 1) { 
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
			getValue: function() { 
				return 4/model.value("novelty"); 
			}
		}),
		new mas.sd.Flow({
			id: 'sysEngineers', 
			name: "System Engineers", 
			desc: "Number of system engineers.",
			units: "People",
			getValue: function() { 
				return Utils.intPart((model.value("conExploration")
							/model.value("ceStaffRatio")) 
						+ (model.value("reqElicit")/model.value("reStaffRatio"))); 
			}
		}),
		new mas.sd.Flow({
			id: 'designers', 
			name: "Designers", 
			desc: "Number of designers.",
			units: "People",
			getValue: function() { 
				return Utils.intPart((model.value("designIntegration")
							/model.value("diStaffRatio")) 
						+ (model.value("changeGen")/model.value("cgStaffRatio"))); 
			}
		}),
		new mas.sd.Flow({
			id: 'testers', 
			name: "Testers", 
			desc: "Number of testers.",
			units: "People",
			getValue: function() { 
				return Utils.intPart((model.value("validation") 
						+ model.value("verification"))/model.value("vvStaffRatio")); 
			}
		}),
		new mas.sd.Flow({
			id: 'spendRate', 
			name: "Spending Rate", 
			desc: "Rate of spending money.",
			units: "$/Month",
			getValue: function() { 
				return (model.value("sysEngineers") + model.value("designers") 
						+ model.value("testers")) * model.value("aveLaborRate"); 
			}
		}),
		new mas.sd.Stock({
			id: 'reqDefined', 
			name: "Requirements Defined", 
			desc: "Number of requirements defined.",
			units: "Reqs",
			getDerivative: function() { 
				return model.value("reqElicit"); 
			}
		}),
		new mas.sd.Stock({
			id: 'archExplored', 
			name: "Architectures Explored", 
			desc: "Number of architectures explored.",
			units: "Archs",
			getDerivative: function() { 
				return Utils.intPart(model.value("conExploration")); 
			}
		}),
		new mas.sd.Stock({
			id: 'archRetained',  
			name: "Architectures Retained", 
			desc: "Number of architectures retained.",
			units: "Archs",
			getDerivative: function() { 
				return Utils.intPart(model.value("conExploration") 
						- model.value("archFiltering")); 
			}
		}),
		new mas.sd.Stock({
			id: 'systemSpecs',
			name: "System Specifications", 
			desc: "Number of system specifications generated.",
			units: "Specs", 
			getDerivative: function() { 
				return model.value("designIntegration"); 
			}
		}),
		new mas.sd.Stock({
			id: 'testsPerformed', 
			name: "Tests Performed", 
			desc: "Number of specifications tested.",
			units: "Tests",
			getDerivative: function() { 
				return model.value("verification"); 
			}
		}),
		new mas.sd.Stock({
			id: 'pendChanges', 
			name: "Pending Changes", 
			desc: "Number of changes pending completion.",
			units: "Changes",
			getDerivative: function() { 
				return model.value("changeGen") - model.value("changeImpl"); 
			}
		}),
		new mas.sd.Stock({
			id: 'cumChanges', 
			name: "Cumulative Changes", 
			desc: "Number of changes generated.",
			units: "Changes",
			getDerivative: function() { 
				return model.value("changeGen"); 
			}
		}),
		new mas.sd.Stock({
			id: 'reqValidated', 
			name: "Requirements Validated", 
			desc: "Number of requirements validated.",
			units: "Reqs",
			getDerivative: function() { 
				return model.value("validation"); 
			}
		}),
		new mas.sd.Stock({
			id: 'nreCost', 
			name: "NRE Cost", 
			desc: "Non-recurring engineering cost.",
			units: "$",
			getDerivative: function() { 
				return model.value("spendRate"); 
			}
		}),
		new mas.sd.Stock({
			id: 'projDuration', 
			name: "Project Duration", 
			desc: "Duration until certificate of completion is achieved.",
			units: "Months",
			getDerivative: function() { 
				return 1 - model.value("certCompletion"); 
			}
		}),
		new mas.sd.Smooth({
			id: 'changeImplSmootha', 
			delayTime: 1, 
			initValue: 1, 
			getInput: function(){ 
				return model.value("changeImplDelay1a"); 
			}
		}),
		new mas.sd.Delay1({
			id: 'archFilteringDelay1a', 
			delayTime: 1, 
			getInput: function() { 
				return model.value("conExploration"); 
			}
		}),
		new mas.sd.Delay1({
			id: 'changeGenDelay1a', 
			delayTime: 1, 
			getInput: function() { 
				return (model.value("strComplexity")/(model.value("reqDefined") + 1))
						*((1 - model.value("fracProblemsCaught"))
							*model.value("verification") 
						+ (1 - model.value("fracProblemsCaught"))
							*model.value("validation") 
						+ (1 - model.value("fracProblemsCaught"))
							*model.value("designIntegration") 
						+ model.value("changeGenDelay1b")); 
			}
		}),
		new mas.sd.Delay1({
			id: 'changeGenDelay1b', 
			delayTime: 4, 
			initValue:0.12, 
			getInitValue: function() {
				return this.getInput();
			}, getInput: function() { 
				return model.value("metaFlag")*model.value("novelty")
						*(1 - model.value("modIntegrity"))
						*model.value("designIntegration"); 
			}
		}),
		new mas.sd.Delay1({
			id: 'changeImplDelay1a', 
			delayTime: 0.5, 
			getInput: function() { 
				return model.value("changeGen"); 
			}
		}),
	];
	/**
	 * Gets an entity instance by ID.
	 * @param {String} id the unique ID
	 * @returns {Object} the entity
	 */
	this.getEntity = function(id) {
		for(var i = 0; i < this.entities.length; i++) {
			if(this.entities[i].id===id) {
				return this.entities[i];
			}
		}
	};
	/**
	 * Gets the value of an entity by ID.
	 * @param {String} id the unique ID
	 * @returns {Number} the value
	 */
	this.value = function(id) {
		var entity = this.getEntity(id);
		if(typeof entity !== 'undefined') {
			return entity.getValue();
		}
	};
}

var model = new isrm();

var sim = new mas.sd.Simulator({
	entities: model.entities,
	initTime: 0,
	timeStep: 0.25,
	maxTime: 30
});
sim.on('init advance', function(time) {
	console.log(time + ' ' + model.value('nreCost'));
});
sim.execute();