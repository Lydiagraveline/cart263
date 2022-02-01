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
const CANNABIS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/plants/cannabis.json`;
const TAROT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`;
const ACADEMIC_SUBJECTS = `https://raw.githubusercontent.com/dariusk/corpora/master/data/books/academic_subjects.json`;
const ENCOURAGING_WORDS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/words/encouraging_words.json`;
const DESCRIPTIONS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/humans/descriptions.json`;
const WEAPON_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/premodern_weapons.json`;
const INSTRUMENT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`;
const STATES_OF_DRUNKENNESS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/words/states_of_drunkenness.json`;
const CLOTHING_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/clothing.json`;
const COLOR_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/colors/xkcd.json`;
const ADVERB_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/words/adverbs.json`;
const WINE_DESCRIPTIONS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/foods/wine_descriptions.json`;
const DISEASE_SYMPTOMS_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/medicine/symptoms.json`;

// The spy profile data while the program is running
let spyProfile = {
  mission: `REDACTED`,
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  description: `**REDACTED**`,
  secretWeapon: `**REDACTED**`,
  disguise: `**REDACTED**`,
  skills: `**REDACTED**`,
  weakness: `**REDACTED**`,
};

// User input variables
let nameInput;
// The buttons
let missionButton;
let aliasButton;
let descriptionButton;
let secretWeaponButton;
let skillsButton;
let weaknessButton;
let disguiseButton;
let randomProfileButton;


// Variables to store JSON data for generating the profile
let cannabisData;
let tarotData;
let academicSubjects;
let encouragingWordsData;
let descriptionsData;
let adverbData;
let weaponData;
let instrumentsData;
let statesOfDrunkennessData;
let clothingData;
let colorData;
let wineDescriptionsData;
let diseaseSymptomsData;

/**
Loads the JSON data used to generate the profile
*/
function preload() {
  cannabisData = loadJSON(CANNABIS_DATA_URL);
  tarotData = loadJSON(TAROT_DATA_URL);
  academicSubjects = loadJSON(ACADEMIC_SUBJECTS);
  encouragingWordsData = loadJSON(ENCOURAGING_WORDS_DATA_URL);
  descriptionsData = loadJSON(DESCRIPTIONS_DATA_URL);
  adverbData = loadJSON(ADVERB_DATA_URL);
  weaponData = loadJSON(WEAPON_DATA_URL);
  instrumentsData = loadJSON(INSTRUMENT_DATA_URL);
  statesOfDrunkennessData = loadJSON(STATES_OF_DRUNKENNESS_DATA_URL);
  clothingData = loadJSON(CLOTHING_DATA_URL);
  colorData = loadJSON(COLOR_DATA_URL);
  wineDescriptionsData = loadJSON(WINE_DESCRIPTIONS_DATA_URL);
  diseaseSymptomsData = loadJSON(DISEASE_SYMPTOMS_DATA_URL);
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

  missionButton = createButton("Mission");
  missionButton.mousePressed(newMission);

  aliasButton = createButton("Alias");
  aliasButton.mousePressed(newAlias);

  descriptionButton = createButton("Description");
  descriptionButton.mousePressed(newDescription);

  secretWeaponButton = createButton("Secret Weapon");
  secretWeaponButton.mousePressed(newSecretWeapon);

  disguiseButton = createButton("Disguise");
  disguiseButton.mousePressed(newDiguise);

  skillsButton = createButton("Special Skill");
  skillsButton.mousePressed(newSkills);

  weaknessButton = createButton("Weakness");
  weaknessButton.mousePressed(newWeakness);

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

  /**
  Generates a new mission name from a cannabis name JSON and capializes it
  */
function newMission(){
  let cannabis = random(cannabisData.cannabis);
  spyProfile.mission = cannabis.toUpperCase();
}

/**
Generates a new alias and capitalizes the first letter of each word
*/
function newAlias(){
  let instrument = random(instrumentsData.instruments);
  let wineDescription = random(wineDescriptionsData.wine_descriptions);
  let statesOfDrunkenness = random(statesOfDrunkennessData.states_of_drunkenness);
  let desciption = [capitalizeFirstLetter(wineDescription), capitalizeFirstLetter(statesOfDrunkenness)];
  spyProfile.alias = `The \"${random(desciption)}\" ${capitalizeFirstLetter(instrument)}`;
}

/**
Generates a new random description with a strenth and an adverb
*/
function newDescription(){
  let adverb = random(adverbData.adverbs);
  let strength = random(encouragingWordsData.encouraging_words);
  let description = random(descriptionsData.descriptions);
  spyProfile.desciption = `${capitalizeFirstLetter(description)} and ${adverb} ${strength}.`;
}

/**
Generates a new random weapon and capitalizes the first letter
*/
function newSecretWeapon(){
  let melee = random(weaponData.data.melee);
  let ranged = random(weaponData.data.ranged);
  let weapons = [capitalizeFirstLetter(melee), capitalizeFirstLetter(ranged)];
  spyProfile.secretWeapon = random(weapons);
}

function newDiguise(){
  let colors = random(colorData.colors);
  let color = colors.color;
  let clothing = random(clothingData.clothes);
  spyProfile.disguise = `${capitalizeFirstLetter(color)} ${clothing}`;
}

function newSkills(){
  let card = random(tarotData.tarot_interpretations);
  let light = random(card.meanings.light);
  let subject = random(academicSubjects.subjects);
  spyProfile.skills = `${light}, and ${subject}.`;
}

function newWeakness(){
  let card = random(tarotData.tarot_interpretations);
  let shadow = random(card.meanings.shadow);
  let diseaseSymptom = random(diseaseSymptomsData.symptoms);
  spyProfile.weakness = shadow + `, and ` + diseaseSymptom;
}

/**
Captialize the first letter in the given string
*/
function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
Generates a spy profile from JSON data
*/
function generateSpyProfile() {
  spyProfile.name = nameInput.value();
  newMission();
  newAlias();
  newDescription();
  newSecretWeapon();
  newDiguise();
  newWeakness();
  newSkills();

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

** MISSION ${spyProfile.mission} **

Agent Name: ${spyProfile.name}
Alias: ${spyProfile.alias}
Description: ${spyProfile.desciption}
Secret Weapon: ${spyProfile.secretWeapon}
Disguise: ${spyProfile.disguise}
Special Skills: ${spyProfile.skills}
Weaknesses: ${spyProfile.weakness}`

  // Display the profile
  push();
  textFont(`Courier, monospace`);
  textSize(16);
  textAlign(LEFT, TOP);
  fill(0);
  text(spyText, 0, 0, width);
  pop();
}
