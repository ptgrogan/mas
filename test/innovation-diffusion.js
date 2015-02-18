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
    // This example is adapted from Gene Bellinger at
    // https://insightmaker.com/insight/9818/Innovation_Diffusion
    // which is adapted from Business Dynamics Ch. 9 (Sterman, 2000)
    
    // Define the Innovation Diffusion model.
    var InnovationDiffusion = function() {
        // define input parameters
        this.params = {
            adoptionFraction: 0.37,
            contactRate: 0.25,
            initialPotentialAdopters: 520,
            initialAdopters: 6.54
        };
        
        // override default parameter values
        for(var n in arguments[0]) {
            this.params[n] = arguments[0][n];
        }
        
        // define SD model components
        this.entities = [
            new mas.sd.Parameter({
                id: 'initialPotentialAdopters',
                value: this.params.initialPotentialAdopters
            }),
            new mas.sd.Stock({
                id: 'potentialAdopters',
                getInitValue: function(sim) {
                    return sim.value('initialPotentialAdopters');
                },
                getDerivative: function(sim) {
                    return -1 * sim.value('adoptionRate');
                }
            }),
            new mas.sd.Parameter({
                id: 'initialAdopters',
                value: this.params.initialAdopters
            }),
            new mas.sd.Stock({
                id: 'adopters',
                getInitValue: function(sim) {
                    return sim.value('initialAdopters');
                },
                getDerivative: function(sim) {
                    return sim.value('adoptionRate');
                }
            }),
            new mas.sd.Flow({
                id: 'totalPopulation',
                getValue: function(sim) {
                    return sim.value('initialPotentialAdopters')
                            + sim.value('initialAdopters');
                }
            }),
            new mas.sd.Parameter({
                id: 'contactRate',
                value: this.params.contactRate
            }),
            new mas.sd.Parameter({
                id: 'adoptionFraction',
                value: this.params.adoptionFraction
            }),
            new mas.sd.Flow({
                id: 'adoptionRate',
                getValue: function(sim) {
                    return sim.value('contactRate') 
                            * sim.value('adoptionFraction') 
                            * sim.value('potentialAdopters') 
                            * sim.value('adopters') 
                            / sim.value('totalPopulation');
                }
            }),
        ];
    };
    
    // instantiate model
    var model = new InnovationDiffusion();
    
    // instantiate simulator
    var sim = new mas.sim.Simulator({
        initTime: 0,
        maxTime: 100,
        timeStep: 0.25,
        entities: model.entities
    });
    
    // output data headers on initialization
    sim.on('init', function(time) {
        console.log('Time\tPotential Adopters\tAdopters');
    });
    
    // output data on initialization and time advance
    sim.on('init advance', function(time) {
       console.log(time 
                + '\t' + sim.value('potentialAdopters').toPrecision(12) 
                + '\t' + sim.value('adopters').toPrecision(12));
    });
    
    // execute the simulation
    var startTime = new Date();
    sim.execute();
    console.log('Simulation completed in ' + (new Date()-startTime) + ' ms');
});