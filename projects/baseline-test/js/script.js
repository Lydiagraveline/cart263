/**
Baseline Test
Lydia Graveline

Program inspired by the Baseline Test from Bladerunner, a test designed to detect
unwanted emotional responses in a "replicant."
*/

"use strict";

/**
Create a canvas
Set up annyang
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Is annyang available?
  if (annyang) {
    // Create the guessing command
    let commands = {};
    // Setup annyang and start
    annyang.addCommands(commands);
    annyang.start();
  }
}

/**
Description of draw()
*/
function draw() {}
