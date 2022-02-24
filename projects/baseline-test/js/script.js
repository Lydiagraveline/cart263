/**
Baseline Test
Lydia Graveline

Program inspired by the Baseline Test from Bladerunner, a test designed to detect
unwanted emotional responses in a "replicant."
*/

"use strict";
let state = `profile`; // can be prompt, start, test, (end?)

//json file
let json;
// The key used to save and load the data for this program
const PROFILE_DATA_KEY = `profile-data`;

// starts the test at the first line
let lineNum = 0;

// The test question
let question;
// The user's detected answer, can be true or false
let speech = false;

//Colors
let bgColor = `#000a0d`;
let strokeColor = `#3b4a4d`;
let textColor = `#96aeb5`;

let profile;
let profileIMG;
let cameraIMG;
let font;

let capture;

let input;
let nameInput = `K D6-3. 7`;


/**
preload the json file
*/
function preload() {
  json = loadJSON(`assets/data/baselineTestScript.json`);
  cameraIMG = loadImage(`assets/images/camera.png`);
  profileIMG = loadImage(`assets/images/profile.png`);
  font = loadFont(`assets/fonts/Tandysoft.ttf`);
}

/**
Create a canvas
Set up annyang
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  formatQuestion();

  // Is annyang available?
  if (annyang) {
    // Create the guessing command
    let commands = {
      test: nextQuestion,
      "(the) system": nextQuestion,
      "(a system of) cells": nextQuestion,
      "(within cells) interlinked (within cells interlinked within cells interlinked)": nextQuestion,
      "within ": nextQuestion,
      "(Within one) Stem": nextQuestion,
      "dreadfully ": nextQuestion,
      "(and)(Dreadfully) Distinct": nextQuestion,
      "(Against the) Dark": nextQuestion,
      "(A tall) (white) fountain (played)": nextQuestion,
      "A blood black nothingness": nextQuestion,
    };
    // Setup annyang and start
    annyang.addCommands(commands);
    annyang.start();
  }

  input = createInput().attribute('placeholder', 'Your Name ').attribute('onfocus',"this.value=''");

  input.position(width/2 + 52, height/2 - 191);
  // input.changed(function nameCallback() {
  //   nameInput = input.value();
  // idInput = makeid();
  //
  //
  // });

  profile = createProfile(
    // setTimeout(function () {
    //   prompt(`whats your name?`);
    // }, 2000),
    //prompt(`whats your name?`),
    //profile.namename,
    //nameInput,
    makeid(),
    `${random([`Combat`, `Military`, `Engineer`, `Politics`])} / ${random([
      `Leader`,
      `Leisure`,
      `Defense Prog.`,
      `Loader (Nuc. Fiss.)`,
      `Homocide`,
    ])}`,
    random([`a`, `b`, `c`]),
    random([`a`, `b`, `c`])
  );

  capture = createCapture(VIDEO);
  capture.size(440, 330);
  capture.hide();
}

/**
Create a new JavaScript Object describing the profile and return it
*/
function createProfile(id, func, physState, mentalState) {
  // the profile
  let profile = {
    name: nameInput, //input.value(),
    id: id,
    function: func,
    physState: physState,
    mentalState: mentalState,
    status: `Training`,
  };
  return profile;
}

/**
Display each state
*/
function draw() {
  background(bgColor);
  input.style(`font-family`, font);
  if (state === `profile`) {
    displayProfile(profile);
  } else if (state === `test`) {
    runTest();
  }
}

function displayProfile(profile) {
  nameInput = input.value();
  input.style('font-family', font);
  push();
  stroke(strokeColor);
  fill(bgColor);

  //imageMode(CORNER)
  imageMode(CENTER);
  //image(capture, width/2 - 230, 0, 320, 240);
  //image(capture, width/2 - 270, height/2 - 208, 100, 335 * capture.height / capture.width);
  image(
    capture,
    width / 2 + 261,
    height / 2 + 10,
    capture.width,
    capture.height
  );

  imageMode(CENTER);
  image(profileIMG, width / 2, height / 2, 1100, 541);
  //  image(cameraIMG, 100, 100, 100, 123)

  rectMode(CORNERS);
  //textAlign(CENTER, CENTER);
  fill(textColor);
  //textFont(font, 30);
  //text(nameInput, width / 2 + 55, height / 2 - 165);

  textLeading(25);
  let statsText = `DES:   (${nameInput.substring(0, 3)}) ${nameInput.charAt(0).split()}-${profile.id}
date
${profile.function}
LEV ${profile.physState}                LEV ${profile.mentalState}
${profile.status}
`;
  textFont(font, 21);
  textAlign(RIGHT);
  text(statsText, width / 2 - 1, height / 2 + 39);

  pop();
}

//generate random ID
function makeid() {
  var id = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789..--#:/";
  //id += `${nameInput.charAt(0).split()}-`;
  for (var i = 0; i < 9; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  return id;
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
  //lineNum++;
  //formatQuestion();
  console.log(mouseX, mouseY);
  //console.log(currentAnswer);
  if (state === `profile`) {
  }
}
