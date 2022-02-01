"use strict";

/*****************

Spy Profile activity
Author Name

generates a randomized spy profile for the user, and ability protects it

Uses:
Darius Kazemi's corpora project:
https://github.com/dariusk/corpora/

******************/

// URLs to JSON data
const TAROT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`;
const OBJECT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json`;
const INSTRUMENT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`;
const FISRT_NAME_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/humans/wrestlers.json`

// The spy profile data while the program is running
let spyProfile = {
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  secretWeapons: `**REDACTED**`,
  ability: `**REDACTED**`,
};

// User input variables
let nameInput;
// The buttons
let aliasButton;
let secretWeaponButton;
let abilityButton;
let randomProfileButton;

// Variables to store JSON data for generating the profile
let nameData;
let tarotData;
let objectsData;
let instrumentsData;

/**
Loads the JSON data used to generate the profile
*/
function preload() {
  nameData = loadJSON(FISRT_NAME_DATA_URL);
  tarotData = loadJSON(TAROT_DATA_URL);
  objectsData = loadJSON(OBJECT_DATA_URL);
  instrumentsData = loadJSON(INSTRUMENT_DATA_URL);
}

/**
Creates a canvas then handles loading profile data, checking ability,
and generating a profile as necessary.
*/
function setup() {
  createCanvas(500, 500);

  createSpan("What's your name? "); //label for name input
  nameInput = createInput();
  nameInput.changed(nameCallback);

  // let data = JSON.parse(localStorage.getItem(`spy-profile-data`));
  // if (data !== null){
  //   let ability = prompt(`What is your ability?`);
  //   if (ability === data.ability){
  //     spyProfile.name = data.name;
  //     spyProfile.alias = data.alias;
  //     spyProfile.secretWeapon = data.secretWeapon;
  //     spyProfile.ability = data.ability;
  //   }
  // }
  // else {
  //   generateSpyProfile();
  // }
// aliasButton = createButton(`alias`);
// aliasButton.mousePressed(generateAlias);

randomProfileButton = createButton("Randomize All");
randomProfileButton.mousePressed(generateSpyProfile);
//generateSpyProfile();
}

/**
Generates a spy profile from JSON data
allows the name displayed to change when there is a new input
*/
function nameCallback() {
  spyProfile.name = nameInput.value();
  }

function sendData(){
  spyProfile.name = nameInput.value();
  generateSpyProfile()
}

// function generateAlias(){
//   let instrument = random(instrumentsData.instruments);
//   spyProfile.alias = `The ${instrument}`;
//   spyProfile.secretWeapon = random(objectsData.objects);
// }

/**
Generates a spy profile from JSON data
*/
function generateSpyProfile() {
  spyProfile.name = random(nameData.wrestlers);
  let instrument = random(instrumentsData.instruments);
  spyProfile.alias = `The ${instrument}`;
  spyProfile.secretWeapon = random(objectsData.objects);
  let card = random(tarotData.tarot_interpretations);
  spyProfile.ability = random(card.keywords);

  // // saves the resulting profile to local storage
  // localStorage.setItem(`spy-profile-data`,JSON.stringify(spyProfile));
}

/**
Displays the current spy profile.
*/
function draw() {
  background(255, 20, 150);

// Generate the profile as a string using the data
  let spyText = `** TOP SECRET SPY PROFILE **

Name: ${spyProfile.name}
Alias: ${spyProfile.alias}
Secret Weapon: ${spyProfile.secretWeapon}
ability: ${spyProfile.ability}`;

  // Display the profile
  push();
  textFont(`Courier, monospace`);
  textSize(24);
  textAlign(LEFT, TOP);
  fill(0);
  text(spyText, 0, 0);
  pop();
}
