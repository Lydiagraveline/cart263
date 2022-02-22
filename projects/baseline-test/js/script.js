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

// starts the test at the first line
let lineNum = 0;

// The test question
let question;
// The user's detected answer, can be true or false
let speech = false;

/**
preload the json file
*/
function preload() {
  json = loadJSON(`assets/data/baselineTestScript.json`);
}

/**
Create a canvas
Set up annyang
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  formatQuestion();
  console.log(`${lineNum}: ${question}`);

  // Is annyang available?
  if (annyang) {
    // Create the guessing command
    let commands = {
      test: nextQuestion,
      "(the) system": nextQuestion,
      "(a system of) cells": nextQuestion,
      "(within cells) interlinked (within cells interlinked within cells interlinked)": nextQuestion,
      within: nextQuestion,
      "(Within one) Stem": nextQuestion,
      Dreadfully: nextQuestion,
      "(and)(Dreadfully) Distinct": nextQuestion,
      "(Against the) Dark": nextQuestion,
      "(A tall) (white) fountain (played)": nextQuestion,
      "A blood black nothingness": nextQuestion,
      sell: nextQuestion,
    };
    // Setup annyang and start
    annyang.addCommands(commands);
    annyang.start();
  }
}

/**
Display each state
*/
function draw() {
  background(0);
  if (state === `test`) {
    runTest();
  }
}

/**
Format the test question
*/
function formatQuestion() {
  // don't display the answer for these specific lines
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
    lineNum === 72 ||
    lineNum === 74 ||
    lineNum === 79 ||
    lineNum === 85 ||
    lineNum === 89 ||
    lineNum > 93
  ) {
    question = `${json.line[lineNum].question}`;
  } else {
    // display the answer
    question = `${json.line[lineNum].question} ${json.line[lineNum].answer}.`;
  }
}

/**
Display the question and answer
*/
function runTest() {
  let answer = json.line[lineNum].answer;
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(`${lineNum}: ${question}`, width / 2, height / 2 - 50);
  text(answer, width / 2, height / 2 + 50);
}

/**
Display the next question
 */
function nextQuestion() {
  speech = checkSpeech();
  lineNum++;
  formatQuestion();
}

/**
Checks if the detected speech is the correct answer
*/
function checkSpeech() {
  //let speech = false;
  annyang.addCallback("resultMatch", function (userSaid, commandText, phrases) {
    // capitalize the first letter of the detected speech to match the correct answer
    let userSaidtoUpperCase =
      userSaid.charAt(0).toUpperCase() + userSaid.slice(1);
    if (userSaidtoUpperCase === `${json.line[lineNum - 1].answer}`) {
      speech = true;
      console.log(`"${userSaidtoUpperCase}" ` + speech);
    } else {
      speech = false;
      console.log(`"${userSaidtoUpperCase}" ` + speech);
    }
  });
  return speech;
}

/**
Go to the next line of the question when mouse is pressed
*/
function mousePressed() {
  //nextQuestion();
  lineNum++;
  formatQuestion();
  //console.log(currentAnswer);
}
