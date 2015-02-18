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
 
var requirejs = require('requirejs');

requirejs.config({
  baseUrl: '../lib',
  nodeRequire: require
});

requirejs(['mas'], function(mas) {
    // This example is adapted from Scott Fortmann-Roe at
    // https://insightmaker.com/insight/129/Predator_Prey
    
    // Define the Predator-Prey model.
    var PredatorPrey = function() {
        // define input parameters
        this.params = {
            initPredator: 111.9,
            initPrey: 164.2,
            predatorDeathRate: 0.12,
            preyBirthRate: 0.16,
            predatorBirthFromPrey: 0.001,
            preyDeathFromPredator: 0.0008
        };
        
        // override default parameter values
        for(var n in arguments[0]) {
            this.params[n] = arguments[0][n];
        }
        
        // define SD model components
        this.entities = [
            new mas.sd.Flow({
                id: 'predatorBirthRate',
                predatorBirthFromPrey: this.params.predatorBirthFromPrey,
                getValue: function(sim) {
                    return sim.value('prey')*this.predatorBirthFromPrey;
                }
            }),
            new mas.sd.Flow({
                id: 'predatorBirths',
                getValue: function(sim) {
                    return sim.value('predator')*sim.value('predatorBirthRate');
                }
            }),
            new mas.sd.Stock({
                id: 'predator',
                initValue: this.params.initPredator,
                getDerivative: function(sim) {
                    return sim.value('predatorBirths') - sim.value('predatorDeaths');
                }
            }),
            new mas.sd.Parameter({
                id: 'predatorDeathRate',
                value: this.params.predatorDeathRate
            }),
            new mas.sd.Flow({
                id: 'predatorDeaths',
                getValue: function(sim) {
                    return sim.value('predator')*sim.value('predatorDeathRate');
                }
            }),
            new mas.sd.Parameter({
                id: 'preyBirthRate',
                value: this.params.preyBirthRate
            }),
            new mas.sd.Flow({
                id: 'preyBirths',
                getValue: function(sim) {
                    return sim.value('prey')*sim.value('preyBirthRate');
                }
            }),
            new mas.sd.Stock({
                id: 'prey',
                initValue: this.params.initPrey,
                getDerivative: function(sim) {
                    return sim.value('preyBirths') - sim.value('preyDeaths');
                }
            }),
            new mas.sd.Flow({
                id: 'preyDeathRate',
                preyDeathFromPredator: this.params.preyDeathFromPredator,
                getValue: function(sim) {
                    return sim.value('predator')*this.preyDeathFromPredator;
                }
            }),
            new mas.sd.Flow({
                id: 'preyDeaths',
                getValue: function(sim) {
                    return sim.value('prey')*sim.value('preyDeathRate');
                }
            }),
        ];
    };
    
    // instantiate model
    var model = new PredatorPrey();
    
    // instantiate simulator
    var sim = new mas.sim.Simulator({
        initTime: 0,
        maxTime: 100,
        timeStep: 1,
        entities: model.entities
    });
    
    // output data headers on initialization
    sim.on('init', function(time) {
        console.log('Time\tPredator\tPrey');
    });
    
    // output data on initialization and time advance
    sim.on('init advance', function(time) {
        console.log(time 
                + '\t' + sim.value('predator').toPrecision(12) 
                + '\t' + sim.value('prey').toPrecision(12));
    });
    
    // execute the simulation
    var startTime = new Date();
    sim.execute();
    console.log('Simulation completed in ' + (new Date()-startTime) + ' ms');
});