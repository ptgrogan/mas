# mas
JavaScript Modeling and Simulation

This library implements basic components required for modeling and simulation in JavaScript. It currently supports a portion of the System Dynamics (SD) formalism.

This package adopts the RequireJS interface for dual use in Node or a browser.

## SD Components and Functions
 * Stock (`mas.sd.Stock`)
 * Flow (`mas.sd.Flow`)
 * Parameter (`mas.sd.Parameter`, a Flow with constant value)
 * Delay1 (`mas.sd.Delay1`, first-order exponential delay function)
 * Smooth (`mas.sd.Smooth`, first-order exponential smoothing function)

## Simulators and Integration Methods
 * Simulator (`mas.sim.Simulator`, a basic simulator with event bindings)
 * LoggingSimulator (`mas.sim.LoggingSimulator`, logs entity values at each time step)

Known limitations:
 * The current time advancement as a decentralized tick/tock procedure only allows an explicit (forward) Euler integration method. More precise methods such as 4th order Runge-Kutta (RK4) would require either a centralized state update function or more numerous iterative data exchange periods.
 * Results cannot be directly compared to outputs of some tools due to a difference in numerical precision. For example, most versions of Vensim only support single-precision floating-point numbers while JavaScript is double-precision.