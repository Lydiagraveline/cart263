/**
Where's Sausage Dog?
Lydia Graveline

Displays a large number of random animal images as well as
a single sausage dog image. The player needs to click on the
dog to win the game.
*/

"use strict";

let state = `title` // can be 'title', 'game', 'end'

// global constants
const NUM_ANIMAL_IMAGES = 10;
const NUM_ANIMALS = 100;

// empty array to store animal images
let animalImages = [];
let animals = [];

// sausage dog object and image variables
let sausageDog = undefined;
let sausageDogImage = undefined;

// load all the animal images and add each image to the animal images array
function preload() {
  for (let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`assets/images/animal${i}.png`);
    animalImages.push(animalImage);
  }

  // Load the sausage dog image
  sausageDogImage = loadImage(`assets/images/sausage-dog.png`);
}

// Creates all the animal objects and a sausage dog object
function setup() {
  createCanvas(windowWidth, windowHeight);

  createAnimals();
  createSausageDog();
}

// Create the animals + add them to the animal array
function createAnimals() {
  for (let i = 0; i < NUM_ANIMALS; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);
    let animal = new Animal (x, y, animalImage);
    animals.push(animal);
  }
}

// create the sausage dog
function createSausageDog() {
  let x = random(0, width);
  let y = random(0, height);
  sausageDog = new SausageDog(x, y, sausageDogImage)
}

// refresh the game
function refresh() {
  //empty the array of animals an then refill it, changing the position of each animal
  animals = [];
  createAnimals();
  // create a new sausage dog at a new position
  createSausageDog();
}

// Draws the background then updates all animals and the sausage dog
function draw() {
  background(255);

  if (state === `title`){
    title();
  }
  else if (state === `game`) {
    updateAnimals();
    updateSausageDog();
  }
  else if (state === `end`) {
    end();
  }
}

// Calls the update() method for all animals
function updateAnimals() {
  // Loop through all animals
  for (let i = 0; i < animals.length; i++) {
    // Update the current animal
    animals[i].update();
  }
}

// Calls the update() method of the sausage dog
function updateSausageDog() {
  sausageDog.update();
}

// Call the sausage dog's mousePressed() method so it knows the mouse was clicked.
function mousePressed() {
  sausageDog.mousePressed();

  if (state === `title`){
    state = `game`;
  }
}

function keyTyped() {
  if (keyCode === ENTER) {
    refresh()
  }
}

///////////////////////////////////////////////////////////////////////////////
function title() {
  background(255);
  push();

  textAlign(CENTER, CENTER);
  textSize(64);
  text(`Where's Sausage Dog?`, width / 2 + 75, height / 4 - 30);

  //updateSausageDog();

  pop();
}
