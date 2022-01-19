/**
Where's Sausage Dog?
Lydia Graveline

Displays a large number of random animal images as well as
a single sausage dog image. The player needs to click on the
dog to win the game.
*/

"use strict";

let state = `title` // can be title, game, end, and horrorEnd
let mode = `undefined` // can be easy, difficult, horror

// the player's score, increases each time sausage dog is found
let score = 0

// countdown timer in seconds
let timer;

// global constants
const NUM_ANIMAL_IMAGES = 10;

// The number of animals is determined by the mode
let NUM_ANIMALS = undefined;

// empty array to store animal images
let animalImages = [];
let animals = [];

// sausage dog object and image variables
let sausageDog = undefined;
let sausageDogImage = undefined;

// horror dog object and image variables
let horrorDog = undefined;
let horrorDogImage = undefined;

// sounds
let barkSFX;
let growlSFX;
let buttonSFX;


// The buttons
let startButton;
let easyButton;
let difficultButton;
let horrorButton;

// load all the animal images and add each image to the animal images array
function preload() {
  for (let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`assets/images/animal${i}.png`);
    animalImages.push(animalImage);
  }

  // Load the dog images
  sausageDogImage = loadImage(`assets/images/sausage-dog.png`);
  horrorDogImage = loadImage(`assets/images/horror-dog.png`);

  // Load the sounds
  barkSFX = loadSound(`assets/sounds/bark.mp3`);
  growlSFX = loadSound(`assets/sounds/growl.mp3`);
  buttonSFX = loadSound(`assets/sounds/button1.mp3`);
}

// Creates the buttons
function setup() {
  createCanvas(800, 600);
  textFont("courier");

  // create the buttons + assign a function on mousePressed
  startButton = createImg(`assets/images/sausage-dog.png`);
  startButton.addClass(`jump`);
  startButton.mousePressed(startGame);
  easyButton = createButton();
  easyButton.mousePressed(easyMode);
  difficultButton = createButton();
  difficultButton.mousePressed(difficultMode);
  horrorButton = createButton();
  horrorButton.mousePressed(horrorMode);

  // add html to the buttons
  startButton.html(`<span class="text">Start Game</span><span>Please select a game mode.</span></button>`)
  easyButton.html(`<span class="text">Easy</span><span>30 seconds</span></button>`)
  difficultButton.html(`<span class="text">Difficult</span><span>60 seconds</span></button>`)
  horrorButton.html(`<span class="text">Horror</span><span>?</span></button>`)
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

// create the horror dog
function createHorrorDog(){
  let x = random(0, width);
  let y = random(0, height);
  horrorDog = new HorrorDog(x, y, horrorDogImage)
}

// refresh the game
function refresh() {
  //empty the array of animals an then refill it, changing the position of each animal
  animals = [];
  createAnimals();
  // create a new sausage dog at a new position
  createSausageDog();
  // create a new horror dog at a new position
  if (mode === `horror`){
    createHorrorDog();
  }
  buttonSFX.play();
}

// changes the state to `game` and hides the buttons + creates the animals
function startGame() {
  buttonSFX.play();

  // will only start if a mode has been selected
  if (mode === `easy` || mode === `difficult` || mode === `horror`) {
    state = `game`;
    createAnimals();
    createSausageDog();
    // create a new horror dog if its horror mode
    if (mode === `horror`){
      createHorrorDog();
      growlSFX.play();
    } else {
      barkSFX.play();
    }

    // hide the buttons
    startButton.style("display", "none")
    easyButton.style("display", "none");
    difficultButton.style("display", "none");
    horrorButton.style("display", "none");
  }
  // Prompts the player to select a game mode before starting the game
  else {
    alert(`Please select a game mode.`)
  }
}

// sets the state to easy mode
function easyMode(){
  buttonSFX.play();
  difficultButton.removeClass('active');
  horrorButton.removeClass('active');
  easyButton.addClass('active');
  mode = `easy`
  NUM_ANIMALS = 50;
  timer = 30;
}

// sets the state to difficult mode
function difficultMode(){
  buttonSFX.play();
  easyButton.removeClass('active');
  horrorButton.removeClass('active');
  difficultButton.addClass('active');
  mode = `difficult`
  NUM_ANIMALS = 100;
  timer = 60;
}

// sets the state to horror mode
function horrorMode(){
  buttonSFX.play();
  easyButton.removeClass('active');
  difficultButton.removeClass('active');
  horrorButton.addClass('active');
  mode = `horror`
  NUM_ANIMALS = 100;
  timer = 60;
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
    //update horror dog if the game mode is horror
    if (mode === `horror`){
      updateHorrorDog();
    }
    countdown();
  }
  else if (state === `end`) {
    end();
  }
  else if (state === `horrorEnd`){
    horrorEnd();
  }
}

// runs a countdown timer and displays it
function countdown(){
  // "countdown timer" by marynotari on editor.p5js
  // https://editor.p5js.org/marynotari/sketches/S1T2ZTMp-
  // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
  if (frameCount % 60 == 0 && timer > 0) {
    timer --;
  }
  if (timer == 0) {
    state = `end`;
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

// Calls the update() method of the horror dog
function updateHorrorDog(){
  horrorDog.update();
}

// Call the sausage dog's mousePressed() method so it knows the mouse was clicked.
function mousePressed() {
  console.log(mouseX, mouseY)
  if (state === `game`){
    sausageDog.mousePressed();
    if (mode === `horror`){
    horrorDog.mousePressed();
    }
  }
}

///////////////////////////////////////////////////////////////////////////////
function title() {
  background(0);
  push();
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255);
  text(`Where's Sausage Dog?`, width / 2, height / 4);

  rectMode(CENTER)
  rect(width / 2, height - 95, 500, 100)

  textSize(12);
  fill(0);
  text(`Select a game mode, then click the sausage dog to begin the game.`, width / 2, height - 120);
  text(`Find and click the sausage dog to earn points,`, width / 2, height - 100);
  text(`save time by clicking again to redirect the sausage dog.`, width / 2, height - 80);
  text(`Get as many points as possible before time runs out!`, width / 2, height - 60);
  pop();

  // display the buttons and center them
  startButton.position(windowWidth/2 - 75, 3 * windowHeight / 5 - 30);
  easyButton.position(windowWidth/3 - 75, windowHeight / 2 - 75);
  difficultButton.position(windowWidth/2 - 75, windowHeight / 2 - 75);
  horrorButton.position(2*windowWidth/3 - 75, windowHeight / 2 - 75);
}

function end(){
  textAlign(CENTER, CENTER);
  textSize(64);
  text(`TIMES UP!`, width/2, height/2 - 50);
  text(`Score: `+ (score), width/2, height/2 + 50 )
}

function horrorEnd() {
  textAlign(CENTER, CENTER);
  textSize(45)
  text(`OH NO! YOU FOUND HORROR DOG!`, width/2, height/2 - 75);
  text(`GAME OVER X_X`, width/2, height/2);
  text(`Score: `+ (score), width/2, height/2 + 75 )
}
