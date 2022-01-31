/**
Spy Profile activity
Author Name

generates a randomized spy profile for the user, and password protects it
*/

"use strict";

// The spy profile data while the program is running
let spyProfile = {
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  secretWeapons: `**REDACTED**`,
  password: `**REDACTED**`,
};

/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  spyProfile.name = prompt(`What is your name?`);
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
