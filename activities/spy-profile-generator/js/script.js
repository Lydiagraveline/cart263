"use strict";

/*****************

Spy Profile activity
Author Name

generates a randomized spy profile for the user, and password protects it

Uses:
Darius Kazemi's corpora project:
https://github.com/dariusk/corpora/

******************/

// URLs to JSON data
const TAROT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`;
const OBJECT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json`;
const INSTRUMENT_DATA_URL = `https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`;

// The spy profile data while the program is running
let spyProfile = {
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  secretWeapons: `**REDACTED**`,
  password: `**REDACTED**`,
};

// Variables to store JSON data for generating the profile
let tarotData;
let objectsData;
let instrumentsData;

/**
Loads the JSON data used to generate the profile
*/
function preload() {
  tarotData = loadJSON(TAROT_DATA_URL);
  objectsData = loadJSON(OBJECT_DATA_URL);
  instrumentsData = loadJSON(INSTRUMENT_DATA_URL);
}

/**
Creates a canvas then handles loading profile data, checking password,
and generating a profile as necessary.
*/
function setup() {
  createCanvas(500, 500);

  let data = JSON.parse(localStorage.getItem(`spy-profile-data`));
  if (data !== null){
    let password = prompt(`What is your password?`);
    if (password === data.password){
      spyProfile.name = data.name;
      spyProfile.alias = data.alias;
      spyProfile.secretWeapon = data.secretWeapon;
      spyProfile.password = data.password;
    }
  }
  else {
    generateSpyProfile();
  }
}

/**
Generates a spy profile from JSON data
*/
function generateSpyProfile() {
  spyProfile.name = prompt(`What is your name?`);
  let instrument = random(instrumentsData.instruments);
  spyProfile.alias = `The ${instrument}`;
  spyProfile.secretWeapon = random(objectsData.objects);
  let card = random(tarotData.tarot_interpretations);
  spyProfile.password = random(card.keywords);

  // saves the resulting profile to local storage
  localStorage.setItem(`spy-profile-data`,JSON.stringify(spyProfile));
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
Password: ${spyProfile.password}`;

  // Display the profile
  push();
  textFont(`Courier, monospace`);
  textSize(24);
  textAlign(LEFT, TOP);
  fill(0);
  text(spyText, 0, 0);
  pop();
}
