/**
Baseline Test
Lydia Graveline

Program inspired by the Baseline Test from Bladerunner, a test designed to detect
unwanted emotional responses in a "replicant."
*/

"use strict";
let state = `test`; // can be start, test, (end?)

//json file
let json;

// starts the test at the beginning, increases when
let lineNum = 0;

let question;

function preload() {
  json = loadJSON(`assets/data/baselineTestScript.json`);
}

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

function draw() {
  background(0);
  if (state === `test`) {
    runTest();
  }
}

/**
Format the test question to repeat or not repeat the answer on specific lines
*/
function formatQuestion() {
  if (
    lineNum === 0 ||
    lineNum === 17 ||
    lineNum === 21 ||
    lineNum === 30 ||
    lineNum === 33 ||
    lineNum === 37 ||
    lineNum === 38 ||
    lineNum === 46 ||
    lineNum === 47 ||
    lineNum === 52 ||
    lineNum === 58 ||
    lineNum === 59 ||
    lineNum === 71 ||
    lineNum === 79 ||
    lineNum === 85 ||
    lineNum === 89 ||
    lineNum > 93
  ) {
    question = `${json.line[lineNum].question}`;
  } else {
    question = `${json.line[lineNum].question} ${json.line[lineNum].answer}`;
  }
}

/**
Display the question and answer
*/
function runTest() {
  formatQuestion();
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(question, width / 2, height / 2 - 50);
  text(json.line[lineNum].answer, width / 2, height / 2 + 50);
}

/**
Go to the next line of the question when mouse is pressed
*/
function mousePressed() {
  lineNum++;
  console.log(lineNum);
}
