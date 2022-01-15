/**
Where's Sausage Dog?
Lydia Graveline

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

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

  // Create the animals + add them to the animal array
  for (let i = 0; i < NUM_ANIMALS; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);
    let animal = new Animal (x, y, animalImage);
    animals.push(animal);
  }

  // create the sausage dog
  let x = random(0, width);
  let y = random(0, height);
  sausageDog = new SausageDog(x, y, sausageDogImage)
}

//draw
function draw() {
  background(255);

  for (let i = 0; i < animals.length; i++) {
    animals[i].update();
  }

  sausageDog.update();
}

// Call the sausage dog's mousePressed() method so it knows the mouse was clicked.
function mousePressed() {
  sausageDog.mousePressed();
}
