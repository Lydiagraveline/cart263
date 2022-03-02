/**
Baseline Test
Lydia Graveline

Program inspired by the Baseline Test from Bladerunner, a test designed to detect
unwanted emotional responses in a "replicant."
*/

"use strict";
let state = `intro`; // can be prompt, start, test, (end?)

//json file
let json;
let practiceJson;

// starts the test at the first line
let lineNum = 0;

let question; // The test question
let questionSpeech;
let userAnswer; // The user's detected answer, can be true or false
let score = 0; //how many questions the user got correct
let micStatus = `MIC OFF`; // mic is on or off

var finalTranscript;
var interimTranscript;

//Colors
let bgColor = `#000a0d`;
let strokeColor = `#3b4a4d`;
let textColor = `#96aeb5`;
let statusFill = `#96aeb5`;

//let profile; // the user's profile
let profileIMG; // background image
let cameraIMG;
let font; // universal font

let capture; // the webcam

let input; //text input
let nameInput = `K D6-3. 7`; // Name inputed by user stored on their profile
//let status = `inception`; // the user's status displayed on the profile

// the text displayed on the console
let consoleVoice = `Input your name to generate stats and begin your training.`;
let testStats; // stats displayed on the console
let consoleLine = 0;
let trainingText = [];
// typewriter effect
let index = 0;
let lastMillis = 0;

let startTime;

// The user's initial profile
let profile = {
  name: nameInput,
  id: `---------`,
  function: `---------`,
  physState: `----  `,
  mentalState: `----`,
  status: `inception`,
};

/**
preload the json file, profile image, and font
*/
function preload() {
  json = loadJSON(`assets/data/baselineTestScript.json`);
  practiceJson = loadJSON(`assets/data/baselinePracticeTest.json`);
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
  //startTime = millis();
  //formatQuestions();

  // checks if responsiveVoice is available which promts the browser to allow play speech
  if (responsiveVoice.voiceSupport()) {
    responsiveVoice.speak(consoleVoice);
  }

  // Is annyang available?
  if (annyang) {
    // Create the commands
    let commands = {
      //test: nextQuestion,
      "system": nextQuestion,
      "the system": nextQuestion,
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
  input.changed(inputCallback); // call when user inputs their name
  input.position(width / 2 + 52, height / 2 - 191);
}

/**
Generates a profile when the input is changed
*/
function inputCallback() {
  createProfile(); // generate initial profile

  // start training
  if (state === `intro`) {
    state = `training`;

    trainingText = [
      `Welcome, ${nameInput}. You are a Nexus 9 model replicant created by the Wallace Corporation.


A replicant is a genetically engineered, bio-enhanced person with para-physical capabilities, composed entirely of organic substance.`,
      `As a NEXUS 9 replicant you are equipt with an open ended lifespan and increased compliance.


Additionally you have been gifted with a past through implanted memories, allowing you to feel and identify as more human.`,
      `In a moment, we will begin the Baseline Test. The baseline test is an examination designed to measure any emotional deviance experienced by Nexus-9 replicants. A series of questions and statements will be verbally delivered, and you must correctly recite the line displayed on the webcam.`,

      `Let's start with a practice round.

Press ENTER to begin.`,
    ];

    resetTypewriter();
  }
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
  profile.physState = `LEV ${random([`a`, `b`, `c`])}`;
  profile.mentalState = `LEV ${random([`a`, `b`, `c`])}`;
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
generates random ID and returns it
*/
function makeid() {
  var id = `N9-${nameInput.charAt(0).split()}`;

  //two random letters from the user's name
  var possible = `${nameInput}`;
  for (var i = 0; i < 2; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));

  // add 5 random numbers
  possible = "0123456789";
  for (var i = 0; i < 5; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  return id;
}

/**
Display each state
*/
function draw() {
  background(bgColor);
  displayProfile(profile);
  if (state === `intro`) {
    consoleDialogue();
    typewriter(consoleVoice);
  } else if (state === `training`) {
    profile.status = `Training`;
    consoleDialogue();
    typewriter(consoleVoice);

    if (
      index > consoleVoice.length &&
      !responsiveVoice.isPlaying() &&
      consoleLine < 3
    ) {
      consoleLine++;
      resetTypewriter();
    } else if (consoleLine === 3 && !responsiveVoice.isPlaying()) {
    }
  } else if (state === `practice`) {
    if (lineNum === 20) {
      consoleVoice = `Training completed. A bug was detected in your physiological responses. A full version of the test including 100 questions will be conducted. You are being tested on the speed and accuracy of your responses. If the test concludes you are off baseline you will be retired.

Press ENTER to begin.`;
      resetTypewriter();
      lineNum = 21;
    } else if (lineNum === 21) {
      statusFill = `red`;
      profile.status = `significant deviance detected`;
      consoleDialogue();
      typewriter(consoleVoice);
    } else if (lineNum < 20) {
      runTest();
    }
  } else if (state === `test`) {
    let s = millis();
    let timeElapsed = millis() - startTime;
    if (
      lineNum === 101 &&
      !responsiveVoice.isPlaying() &&
      index > consoleVoice.length
    ) {
      state = `fin`;
    } else if (lineNum < 100) {
      runTest();
      testStats = `${int((lineNum / 100) * 100)}% complete   ${int(
        timeElapsed * 0.001
      )} seconds elapsed

${int((score / lineNum) * 100)}% accuracy
  `;
      consoleStats();
    } else if (lineNum === 100) {
      consoleVoice = `Test completed. You are off baseline.

Illegal Memories have been detected.





You will now be retired.`;
      resetTypewriter();
      lineNum = 101;
    } else if (lineNum === 101) {
      profile.status = `Arrest warrant no 29772
counterfeiting/fraud`;

      consoleDialogue();
      typewriter(consoleVoice);
    }
  } else if (state === `fin`) {
    input.hide();
    background(`red`);
  }
}

/**
Format the test question
*/
function formatQuestions() {
  if (state === `practice`) {
    questionSpeech = `${practiceJson.line[lineNum].question}`;

    question = `${practiceJson.line[lineNum].question}


${practiceJson.line[lineNum].answer}.`;
  } else {
    questionSpeech = `${json.line[lineNum].question}`;
    // don't display the answer for these specific lines
    if (
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
}

/**
Use annyang and responsive voice to run the test
Display the question and answer
*/
function runTest() {
  formatQuestions();
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

  // Display the user's detected voice and the question
  push();
  fill(textColor);
  textFont(font, 20);
  textAlign(RIGHT);

  text(interimTranscript, width / 2 - 145, height / 2 + 216, 630, 30);

  textAlign(LEFT);
  blendMode(DIFFERENCE);
  text(`${question}`, width / 2 + 55, height / 2 - 140, 440, 330);
  pop();
}

/**
Display the console text
 */
function consoleDialogue() {
  push();
  fill(textColor);
  textFont(font, 20);
  text(
    consoleVoice.substring(0, index),
    width / 2 - 470,
    height / 2 - 175,
    480,
    300
  );
  pop();
}

function consoleStats() {
  push();
  fill(textColor);
  textFont(font, 20);
  text(testStats, width / 2 - 470, height / 2 - 155);
  pop();
}

/**
typewriter effect by cfoss at
https://editor.p5js.org/cfoss/sketches/SJggPXhcQ
*/
function typewriter(text) {
  if (millis() > lastMillis + 60) {
    index = index + 1;
    lastMillis = millis();
  }
}

/**
Resets the typewritter
*/
function resetTypewriter() {
  index = 0;
  lastMillis = millis();
  if (state === `training`) {
    consoleVoice = trainingText[consoleLine];
    responsiveVoice.speak(consoleVoice);
  } else if (state === `practice` || state === `test`) {
    responsiveVoice.speak(consoleVoice);
  }
}

/**
Display the next question
 */
function nextQuestion() {
  userAnswer = checkAnswer();
  if (userAnswer === true) {
    score++;
  }
  interimTranscript = "";
  lineNum++;
  formatQuestions();
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
    if (userSaid === `${json.line[lineNum - 1].answer}`) {
      userAnswer = true;
    }
    // First question will always be correct
    else if (json.line[1].answer) {
      userAnswer = true;
      score = 1;
    } else if (!userSaid === `${json.line[lineNum - 1].answer}`){
      userAnswer = false;
    }
  });
  return userAnswer;
}

/**
Displays the background image, webcam, and text
*/
function displayProfile(profile) {
  nameInput = input.value();
  input.style("font-family", font);
  push();

  // Display the user's webcam
  imageMode(CENTER);
  image(
    capture,
    width / 2 + 261,
    height / 2 + 10,
    capture.width,
    capture.height
  );

  // Display the background image
  image(profileIMG, width / 2, height / 2, 1100, 541);

  // Display the mic status
  fill(textColor);
  textFont(font, 12);
  textAlign(LEFT);
  text(micStatus, width / 2 + 42, height / 2 + 207);

  // Display the profile stats
  let statsText = `ID:  ${profile.id}
${getDate()}
${profile.function}
${profile.physState}                ${profile.mentalState}
`;
  textLeading(25);
  textFont(font, 21);
  text(`(${nameInput.substring(0, 3)})`, width / 2 - 350, height / 2 + 110);
  textAlign(RIGHT);
  text(statsText, width / 2 - 1, height / 2 + 112);
  fill(statusFill);
  textLeading(28);
  text(profile.status, width / 2 - 1, height / 2 + 212);
  pop();
}

function keyPressed() {
  if (keyCode === ENTER) {
    //Start training
    if (state === `training` && consoleLine === 3) {
      state = `practice`;
      responsiveVoice.speak(
        `Lets start by learning the baseline, repeat what I say and remember these lines. A blood black nothingness.`
      );
    }
    // skip introduction
    else if (state === `training` && consoleLine < 3 && consoleLine >= 0) {
      consoleLine++;
      resetTypewriter();
      consoleDialogue();
      typewriter(consoleVoice);
      // Start the official test
    } else if (state === `practice` && lineNum === 21) {
      startTime = millis();
      lineNum = 0;
      state = `test`;
      responsiveVoice.speak(
        `Replicant ${nameInput}. Let's begin. Recite your Baseline.`
      );
      // Skip practice questions
    } else if (state === `practice` && lineNum < 21) {
      lineNum++;
    }
  }
}
