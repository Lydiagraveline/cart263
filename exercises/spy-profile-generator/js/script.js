"use strict";

/*****************

Spy Profile activity
Author Name

generates a randomized spy profile for the user, and weakness protects it

Uses:
Darius Kazemi's corpora project:
https://github.com/dariusk/corpora/

******************/

// URLs to JSON data
const TAROT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`;
const ENCOURAGING_WORDS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/words/encouraging_words.json`
const WEAPON_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/premodern_weapons.json`
const OBJECT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json`;
const INSTRUMENT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`;
const NAME_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/words/literature/infinitejest.json`
const STATES_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/words/states_of_drunkenness.json`
// The spy profile data while the program is running
let spyProfile = {
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  secretWeapon: `**REDACTED**`,
  strength: `**REDACTED**`,
  weakness: `**REDACTED**`,
  fear: `**REDACTED**`,
};

// User input variables
let nameInput;
// The buttons
let aliasButton;
let secretWeaponButton;
let strengthButton;
let weaknessButton;
let randomProfileButton;

// Variables to store JSON data for generating the profile
let nameData;
let tarotData;
let encouragingWordsData;
let weaponData;
let objectsData;
let instrumentsData;

/**
Loads the JSON data used to generate the profile
*/
function preload() {
  nameData = loadJSON(NAME_DATA_URL);
  tarotData = loadJSON(TAROT_DATA_URL);
  encouragingWordsData = loadJSON(ENCOURAGING_WORDS_DATA_URL)
  weaponData = loadJSON(WEAPON_DATA_URL);
  objectsData = loadJSON(OBJECT_DATA_URL);
  instrumentsData = loadJSON(INSTRUMENT_DATA_URL);
}

/**
Creates a canvas then handles loading profile data, checking weakness,
and generating a profile as necessary.
*/
function setup() {
  createCanvas(700, 500);

  createSpan("What's your name? "); //label for name input
  nameInput = createInput();
  nameInput.changed(nameCallback);

  aliasButton = createButton("Alias");
  aliasButton.mousePressed(newAlias);

  secretWeaponButton = createButton("Secret Weapon");
  secretWeaponButton.mousePressed(newSecretWeapon);

  strengthButton = createButton("Strength");
  strengthButton.mousePressed(newStrength);

  weaknessButton = createButton("weakness");
  weaknessButton.mousePressed(newweakness);

  randomProfileButton = createButton("Randomize All");
  randomProfileButton.mousePressed(generateSpyProfile);

  // let data = JSON.parse(localStorage.getItem(`spy-profile-data`));
  // if (data !== null){
  //   let weakness = prompt(`What is your weakness?`);
  //   if (weakness === data.weakness){
  //     spyProfile.name = data.name;
  //     spyProfile.alias = data.alias;
  //     spyProfile.secretWeapon = data.secretWeapon;
  //     spyProfile.weakness = data.weakness;
  //   }
  // }
  // else {
  //   generateSpyProfile();
  // }
// aliasButton = createButton(`alias`);
// aliasButton.mousePressed(generateAlias);

}

/**
Generates a spy profile from JSON data
allows the name displayed to change when there is a new input
*/
function nameCallback() {
  spyProfile.name = nameInput.value();
  }

function newAlias(){
  let instrument = random(instrumentsData.instruments);
  spyProfile.alias = `The ${instrument}`;
}

function newSecretWeapon(){
  spyProfile.secretWeapon = random(objectsData.objects);
}

function newweakness(){
  let card = random(tarotData.tarot_interpretations);
  spyProfile.weakness = random(card.meanings.shadow);
}

function newStrength(){
  spyProfile.strength = random(encouragingWordsData.encouraging_words)
}

function sendData(){
  spyProfile.name = nameInput.value();
  generateSpyProfile()
}

/**
Generates a spy profile from JSON data
*/
function generateSpyProfile() {
  spyProfile.name = random(nameData.infinitejest);
  newAlias();
  newSecretWeapon();
  newweakness();
  newStrength();

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

Agent Name: ${spyProfile.name}
Alias: ${spyProfile.alias}
Secret Weapon: ${spyProfile.secretWeapon}
Strength: ${spyProfile.strength}
weakness: ${spyProfile.weakness}
Fear: ${spyProfile.fear}`

  // Display the profile
  push();
  textFont(`Courier, monospace`);
  textSize(24);
  textAlign(LEFT, TOP);
  fill(0);
  text(spyText, 0, 0);
  pop();
}
