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
// The key used to save and load the data for this program
const PROFILE_DATA_KEY = `profile-data`;

// starts the test at the first line
let lineNum = 0;

let question; // The test question
let questionSpeech;
let userAnswer = false; // The user's detected answer, can be true or false
let micStatus = `MIC OFF`; // mic is on or off

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
//let status = `inception`; // the user's status displayed on the profile

// the text displayed on the console
let consoleVoice = `Input your name to generate stats and begin your training.`;
let consoleLine = 0;
let trainingText = []
// typewriter effect
let index = 0;
let lastMillis = 0;

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
  //formatQuestions();

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

     trainingText = [`Welcome, ${nameInput}. You are a Nexus 9 model replicant created by the Wallace Corporation.


 A replicant is a genetically engineered, bio-enhanced person with para-physical capabilities, composed entirely of organic substance.`,
 `As a NEXUS 9 replicant you are equipt with an open ended lifespan and increased compliance.


 Additionally you have been gifted with a past through implanted memories, allowing you to feel and identify as more human.`,
 `In a moment, we will begin the Baseline Test. The baseline test is an examination designed to measure any emotional deviance experienced by Nexus-9 replicants. A series of questions and statements will be verbally delivered, and you must correctly recite the line displayed on the webcam.`,


`Let's start with a practice round.

Press ENTER to begin.`];

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
  //profile.status = status
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
    displayConsole();
    typewriter(consoleVoice);
  } else if (state === `training`) {
    profile.status = `Training`;
    displayConsole();
    typewriter(consoleVoice);

    if (index > consoleVoice.length && !responsiveVoice.isPlaying() && consoleLine < 3){
      consoleLine++
      resetTypewriter()
      displayConsole();
      typewriter(consoleVoice)
    } else if (consoleLine === 3 && !responsiveVoice.isPlaying()) {
     }
  } else if (state === `practice`) {
    runTest();
  } else if (state === `test`){
    runTest();
  }
}

/**
Format the test question
*/
function formatQuestions() {
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
function displayConsole() {
  push();
  fill(textColor);
  textFont(font, 20);
//textAlign(LEFT, BOTTOM);
text(consoleVoice.substring(0, index), width / 2 - 470, height / 2 - 175 , 480, 300);
  pop();
}

/**
typewriter effect by cfoss at
https://editor.p5js.org/cfoss/sketches/SJggPXhcQ
*/
function typewriter(text) {
  if (millis() > lastMillis + 60) {
    index = index + 1;
		//ONE WORD AT A TIME
		// while(message.charAt(index) != ' ' &&
		// 		 index < message.length){
		// 	index = index + 1;
		// }
		lastMillis = millis();
  }
}

/**
Resets the typewritter
*/
function resetTypewriter() {
  if (state === `training`){
    index = 0;
    lastMillis = millis();
    consoleVoice = trainingText[consoleLine]
    responsiveVoice.speak(consoleVoice);
  } else {
    index = 0;
    lastMillis = millis();
  }

}

/**
Display the next question
 */
function nextQuestion() {
  interimTranscript = "";
  userAnswer = checkAnswer();
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

      //console.log(`"${userSaid}" ` + speech);
    } else {
      userAnswer = false;
      //  console.log(`"${userSaid}" ` + speech);
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
${profile.status}
`;
  textLeading(25);
  textFont(font, 21);
  text(`(${nameInput.substring(0, 3)})`, width / 2 - 350, height / 2 + 110);
  textAlign(RIGHT);
  text(statsText, width / 2 - 1, height / 2 + 112);
  pop();
}

/**
Go to the next line of the question when mouse is pressed
*/
function mousePressed() {
  // // If the mouse clicks on a profile stat, that stat will be changed
  // // gender
  // if (
  //   mouseX > width / 2 - 480 &&
  //   mouseY > height / 2 + 10 &&
  //   mouseX < width / 2 &&
  //   mouseY < height / 2 + 170
  // ) {
  //   console.log(`?`);
  //   createProfile();
  // }
  console.log(mouseX, mouseY);
  //  console.log(`listening ${annyang.isListening()}`);
  //console.log(currentAnswer);
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (state === `training` && consoleLine === 3 ){
      state = `practice`;
      console.log(state)
    }
    consoleLine++
    resetTypewriter()
    displayConsole();
    typewriter(consoleVoice)
  }
}
