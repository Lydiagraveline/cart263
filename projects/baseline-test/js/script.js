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

let question; // The test question
let questionSpeech;
let userAnswer = false; // The user's detected answer, can be true or false
let micStatus; // mic is on or off

// user's voice
var finalTranscript;
var interimTranscript;

//Colors
let bgColor = `#000a0d`;
let strokeColor = `#3b4a4d`;
let textColor = `#96aeb5`;

//let profile; // the user's profile
let profileIMG; // background image
let cameraIMG;
let font; // universal font

let capture; // the webcam

let input; //text input
let nameInput = `K D6-3. 7`; // Name inputed by user stored on their profile

// profile
let profile = {
  name: nameInput,
  id: undefined,
  function: undefined,
  physState: undefined,
  mentalState: undefined,
  status: `Training`,
};

/**
preload the json file, profile image, and font
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
create text input and webcam capture
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  createProfile();
  formatQuestion(); // generate initial profile

  // checks if responsiveVoice is available which promts the browser to allow play speech
  if (responsiveVoice.voiceSupport()) {
    responsiveVoice.speak(" ");
  }

  // Is annyang available?
  if (annyang) {
    // Create the commands
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
    annyang.addCommands(commands);
  }

  // Create a webcam capture and hide it
  capture = createCapture(VIDEO);
  capture.size(440, 330);
  capture.hide();

  // Create an input and add attributes
  input = createInput()
    .attribute("placeholder", "Your Name ")
    .attribute("onfocus", "this.value=''");
  input.position(width / 2 + 52, height / 2 - 191);
}

/**
Generates a profile with random stats
*/
function createProfile() {
  profile.id = makeid();
  profile.function = `${random([
    `Combat`,
    `Military`,
    `Engineer`,
    `Politics`,
  ])} / ${random([
    `Leader`,
    `Leisure`,
    `Defense Prog.`,
    `Loader (Nuc. Fiss.)`,
    `Homocide`,
  ])}`;
  profile.physState = random([`a`, `b`, `c`]);
  profile.mentalState = random([`a`, `b`, `c`]);
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
    micStatus = `MIC OFF`;
  } else if (state === `test`) {
    runTest();
  }
}

function displayProfile(profile) {
  nameInput = input.value();
  input.style("font-family", font);
  push();
  fill(255);

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

  let statsText = `ID:  ${nameInput.charAt(0).split()}-${profile.id}
${getDate()}
${profile.function}
LEV ${profile.physState}                LEV ${profile.mentalState}
${profile.status}
`;
  fill(textColor);
  textLeading(25);
  textFont(font, 21);
  text(`(${nameInput.substring(0, 3)})`, width / 2 - 350, height / 2 + 38);
  textAlign(RIGHT);
  text(statsText, width / 2 - 1, height / 2 + 39);
  pop();
}

/**
Get the current date and format it
*/
function getDate() {
  let date = new Date();
  function formateDate() {
    return date.toDateString().slice(4);
  }
  return formateDate();
}

/**
generate random ID
*/
function makeid() {
  var id = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
  push();
  //  rectMode(CORNERS);
  fill(textColor);
  textFont(font, 20);
  textAlign(RIGHT);

  text(interimTranscript, width / 2 - 145, height / 2 + 216, 630, 30);

  textAlign(LEFT);
  blendMode(DIFFERENCE);
  text(`${question}`, width / 2 + 55, height/2 - 140, 440, 330);

  pop();
}

/**
Display the next question
 */
function nextQuestion() {
  interimTranscript = "";
  userAnswer = checkAnswer();
  lineNum++;
  formatQuestion();
  responsiveVoice.speak(questionSpeech);
}

/**
Checks if the detected speech is the correct answer
*/
function checkAnswer() {
  //let speech = false;
  annyang.addCallback("resultMatch", function (userSaid, commandText, phrases) {
    // capitalize the first letter of the detected speech to match the correct answer
    userSaid = userSaid.charAt(0).toUpperCase() + userSaid.slice(1);

    //console.log(phrases);
    text(`test`, 100, 100);
    if (userSaid === `${json.line[lineNum - 1].answer}`) {
      userAnswer = true;

      //console.log(`"${userSaid}" ` + speech);
    } else {
      userAnswer = false;
      //  console.log(`"${userSaid}" ` + speech);
    }
  });
  return userAnswer;
}

function drawRect() {
  rectMode(CORNERS);
  rect(width / 2 - 480, height / 2 + 10, width / 2, height / 2 + 170);
}

/**
Go to the next line of the question when mouse is pressed
*/
function mousePressed() {
  // If the mouse clicks on a profile stat, that stat will be changed
  // gender
  if (
    mouseX > width / 2 - 480 &&
    mouseY > height / 2 + 10 &&
    mouseX < width / 2 &&
    mouseY < height / 2 + 170
  ) {
    console.log(`?`);
    createProfile();
  }
  //nextQuestion(); width/2 - 475, height/2 + 10, width/2 - 325, height/2 + 45
  //lineNum++;
  //formatQuestion();
  console.log(mouseX, mouseY);
  //  console.log(`listening ${annyang.isListening()}`);
  //console.log(currentAnswer);
}

function keyPressed() {
  if (keyCode === ENTER) {
    state = `test`;
    nextQuestion();
    //console.log(state);
  }
}
