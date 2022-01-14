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

// load all the animal images and add each image to the animal images array
function preload() {
  for (let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`assets/images/animal${i}.png`);
    animalImages.push(animalImage);
  }
}

// set up the canvas and animals
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
}

//draw
function draw() {
  background(255);

  for (let i = 0; i < animals.length; i++) {
    animals[i].update();
  }
}
