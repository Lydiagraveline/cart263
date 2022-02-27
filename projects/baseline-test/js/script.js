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
let questionSpeech;
// The user's detected answer, can be true or false
let speech = false;
let micStatus; // mic is on or off
let detections;

// user's voice
var finalTranscript;
var interimTranscript;

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

  // checks if responsiveVoice is available which promts the browser to allow play speech
  if (responsiveVoice.voiceSupport()) {
    responsiveVoice.speak(" ");
  }

  // Is annyang available?
  if (annyang) {
    // Create the guessing command
    let commands = {
      //test: nextQuestion,
      "(the) system": nextQuestion,
      "(a system of) cells": nextQuestion,
      "(within cells) interlinked (within cells interlinked within cells interlinked)": nextQuestion,
      //"with": nextQuestion,
      within: nextQuestion,
      "(Within one) Stem": nextQuestion,
      dreadfully: nextQuestion,
      "(and)(Dreadfully) Distinct": nextQuestion,
      "(Against the) Dark": nextQuestion,
      "(A tall) (white) fountain (played)": nextQuestion,
      "(A) blood black nothingness": nextQuestion,
      "*anything": nextQuestion,
    };
    // Setup annyang and start
    annyang.addCommands(commands);
    //annyang.start();
  }

  input = createInput()
    .attribute("placeholder", "Your Name ")
    .attribute("onfocus", "this.value=''");
  input.position(width / 2 + 52, height / 2 - 191);

  profile = createProfile(
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
  displayProfile(profile);

  push();
  fill(textColor);
  textFont(font, 12);
  textAlign(LEFT);

  text(micStatus, width / 2 - 190, height / 2 + 209);

  pop();

  input.style(`font-family`, font);

  if (state === `profile`) {
    //annyang.pause();
    micStatus = `MIC OFF`;
  } else if (state === `test`) {
    runTest();

    //annyang.start();
  }
}

function displayProfile(profile) {
  nameInput = input.value();
  input.style("font-family", font);
  push();
  stroke(strokeColor);
  fill(bgColor);

  imageMode(CENTER);
  image(
    capture,
    width / 2 + 261,
    height / 2 + 10,
    capture.width,
    capture.height
  );

  imageMode(CENTER);
  image(profileIMG, width / 2, height / 2, 1100, 541);

  rectMode(CORNERS);
  fill(textColor);

  textLeading(25);
  let statsText = `DES:   (${nameInput.substring(0, 3)}) ${nameInput
    .charAt(0)
    .split()}-${profile.id}
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
  questionSpeech = `${json.line[lineNum].question}`;
  // don't display the answer for these specific lines
  if (
    lineNum === 0 ||
    lineNum === 17 ||
    lineNum === 21 ||
    lineNum === 30 ||
    lineNum === 33 ||
    lineNum === 37 ||
    lineNum === 38 ||
    lineNum === 47 ||
    lineNum === 52 ||
    lineNum === 58 ||
    lineNum === 59 ||
    lineNum === 71 ||
    lineNum === 74 ||
    lineNum === 79 ||
    lineNum === 85 ||
    lineNum === 89 ||
    lineNum > 93
  ) {
    question = `${json.line[lineNum].question}`;
  } else {
    // display the answer
    question = `${json.line[lineNum].question}


${json.line[lineNum].answer}.`;
  }
}

/**
Display the question and answer
*/
function runTest() {
  let answer = json.line[lineNum].answer;

  push();
  fill(textColor);
  textFont(font, 22);

  textSize(21);
  textAlign(RIGHT);

  // stop annyang when responsiveVoice is speaking
  if (responsiveVoice.isPlaying()) {
    annyang.abort();
    interimTranscript = "";
    micStatus = `MIC OFF, SYSTEM SPEAKING`;
  } else {
    // start annyang when responsiveVoice isn't speaking
    annyang.start({ autoRestart: false, continuous: false });
  }

  // Display text when listening for voice
  annyang.addCallback(`start`, function () {
    interimTranscript = "listening...";
    micStatus = `MIC ON, LISTENING FOR VOICE COMMANDS`;
  });

  // Display interim results of the detected speech
  // solution by @tar-gezed in https://github.com/TalAter/annyang/issues/101#issuecomment-216495177_
  var recognition = annyang.getSpeechRecognizer();
  recognition.interimResults = true;
  recognition.onresult = function (event) {
    finalTranscript = "";
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        annyang.trigger(finalTranscript);
      } else {
        interimTranscript = event.results[i][0].transcript;
      }
    }
  };

  text(interimTranscript, width / 2 + 470, height / 2 + 240);

  textAlign(LEFT);
  blendMode(DIFFERENCE);
  text(`${question}`, width / 2 + 55, 250, width, 250);

  pop();
}

/**
Display the next question
 */
function nextQuestion() {
  interimTranscript = "";
  speech = checkSpeech();
  lineNum++;
  formatQuestion();
  responsiveVoice.speak(questionSpeech);
  //annyang.abort()
}

/**
Checks if the detected speech is the correct answer
*/
function checkSpeech() {
  //let speech = false;
  annyang.addCallback("resultMatch", function (userSaid, commandText, phrases) {
    // capitalize the first letter of the detected speech to match the correct answer
    userSaid = userSaid.charAt(0).toUpperCase() + userSaid.slice(1);

    //console.log(phrases);
    text(`test`, 100, 100);
    if (userSaid === `${json.line[lineNum - 1].answer}`) {
      speech = true;

      //console.log(`"${userSaid}" ` + speech);
    } else {
      speech = false;
      //  console.log(`"${userSaid}" ` + speech);
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
  //console.log(mouseX, mouseY);
  //  console.log(`listening ${annyang.isListening()}`);
  //console.log(currentAnswer);
  if (state === `profile`) {
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    state = `test`;
    nextQuestion();
    //console.log(state);
  }
}
