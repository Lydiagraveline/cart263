"use strict";

/*****************

Spy Profile Generator
Lydia

generates a randomized spy profile for the user

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
//default spy photo
let img;
//user input photo
let fileInput;

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

  // load the default spy image
  img = loadImage("assets/images/spy.jpeg");
}

/**
Creates a canvas then creates buttons and inputs
*/
function setup() {
  var cnv = createCanvas(425, 550);

  createSpan("What's your name? "); //label for name input
  nameInput = createInput();
  //nameInput.position(static);
  nameInput.changed(nameCallback);
  // nameInput.addClass('menu');

  createSpan("Choose a photo for your spy profile!"); //label for file input
  fileInput = createFileInput(handleFile);

  randomProfileButton = createButton("Randomize All");
  randomProfileButton.mousePressed(generateSpyProfile);
  //randomProfileButton.parent('menu');

  missionButton = createButton("Mission");
  missionButton.mousePressed(newMission);
  //missionButton.parent('menu');

  aliasButton = createButton("Alias");
  aliasButton.mousePressed(newAlias);
  //aliasButton.parent('menu');

  descriptionButton = createButton("Description");
  descriptionButton.mousePressed(newDescription);
  //descriptionButton.parent('menu');

  secretWeaponButton = createButton("Secret Weapon");
  secretWeaponButton.mousePressed(newSecretWeapon);
  //secretWeaponButton.parent('menu');

  disguiseButton = createButton("Disguise");
  disguiseButton.mousePressed(newDiguise);
  //disguiseButton.parent('menu');

  skillsButton = createButton("Special Skill");
  skillsButton.mousePressed(newSkills);
  //skillsButton.parent('menu');

  weaknessButton = createButton("Weakness");
  weaknessButton.mousePressed(newWeakness);
  //weaknessButton.parent('menu');
}

/**
Generates a spy profile from JSON data
allows the name displayed to change when there is a new input
*/
function nameCallback() {
  spyProfile.name = nameInput.value();
}

/**
handle the file input
*/
function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
  } else {
    img = loadImage("assets/images/spy.jpeg");
  }
}

/**
  Generates a new mission name from a cannabis name JSON and capializes it
  */
function newMission() {
  let cannabis = random(cannabisData.cannabis);
  spyProfile.mission = cannabis.toUpperCase();
}

/**
Generates a new alias and capitalizes the first letter of each word
*/
function newAlias() {
  let instrument = random(instrumentsData.instruments);
  let wineDescription = random(wineDescriptionsData.wine_descriptions);
  let statesOfDrunkenness = random(
    statesOfDrunkennessData.states_of_drunkenness
  );
  let desciption = [
    capitalizeFirstLetter(wineDescription),
    capitalizeFirstLetter(statesOfDrunkenness),
  ];
  spyProfile.alias = `The \"${random(desciption)}\" ${capitalizeFirstLetter(
    instrument
  )}`;
}

/**
Generates a new random description with a strenth and an adverb
*/
function newDescription() {
  let adverb = random(adverbData.adverbs);
  let strength = random(encouragingWordsData.encouraging_words);
  let description = random(descriptionsData.descriptions);
  spyProfile.desciption = `${capitalizeFirstLetter(
    description
  )} and ${adverb} ${strength}.`;
}

/**
Generates a new random weapon and capitalizes the first letter
*/
function newSecretWeapon() {
  let melee = random(weaponData.data.melee);
  let ranged = random(weaponData.data.ranged);
  let weapons = [capitalizeFirstLetter(melee), capitalizeFirstLetter(ranged)];
  spyProfile.secretWeapon = random(weapons);
}

/**
Generates a new disguise
*/
function newDiguise() {
  let colors = random(colorData.colors);
  let color = colors.color;
  let clothing = random(clothingData.clothes);
  spyProfile.disguise = `${capitalizeFirstLetter(color)} ${clothing}`;
}

/**
Generates a new special skill
*/
function newSkills() {
  let card = random(tarotData.tarot_interpretations);
  let light = random(card.meanings.light);
  let subject = random(academicSubjects.subjects);
  spyProfile.skills = `${light}, and ${subject}.`;
}

/**
Generates a new weakness
*/
function newWeakness() {
  let card = random(tarotData.tarot_interpretations);
  let shadow = random(card.meanings.shadow);
  let diseaseSymptom = random(diseaseSymptomsData.symptoms);
  spyProfile.weakness = `${shadow}, and ${diseaseSymptom}.`;
}

/**
Captialize the first letter in the given string
*/
function capitalizeFirstLetter(string) {
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
}

/**
Displays the current spy profile.
*/
function draw() {
  background(255, 20, 150);

// Generate the profile as a string using the data
let spyText = `Agent Name: ${spyProfile.name}

Description: ${spyProfile.desciption}

Secret Weapon: ${spyProfile.secretWeapon}

Disguise: ${spyProfile.disguise}`;

  // Display the profile
  push();
  fill(255);
  noStroke();
  //text boxes

  rect(10, 10, width - 20, 45);
  rect(10, height - 110, width - 20, 100);
  rect(10, height - 200, width - 20, 80);

  // the text
  textFont(`Courier, monospace`);
  textSize(16);
  fill(0);
  textAlign(CENTER, TOP);
  text(`** TOP SECRET SPY PROFILE **`, width / 2, 15);
  text(`** MISSION ${spyProfile.mission} **`, width / 2, 35);
  text(`Alias: `, width / 4, 280, width);
  text(`${spyProfile.alias}`, width / 2, 300, 195);
  textAlign(LEFT, TOP);
  text(spyText, 15, 70, 200);
  text(
    `Special Skills: ${spyProfile.skills}`,
    15,
    height - 190,
    width - 15,
    height
  );
  text(
    `Weaknesses: ${spyProfile.weakness}`,
    15,
    height - 100,
    width - 15,
    height
  );
  pop();

  //the image
  push();

  fill(255, 255, 255, 190);
  stroke(255);
  strokeWeight(5)
  rect(width - 213, 65, 200, 200);
  blendMode(OVERLAY);
  if (img){
    image(img, width - 213, 65, 200, 200);
  }
pop();
}
