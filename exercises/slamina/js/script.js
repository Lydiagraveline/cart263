/**
Slamina
Lydia Graveline

A guessing game in which the page pronounces the name of an animal
backwards and the user has to figure out what it was and say the
name forwards.
*/

"use strict";

//An array of animal names from
//https://github.com/dariusk/corpora/blob/master/data/animals/common.json
// const animals = [
//       "aardvark",
//       "alligator",
//       "alpaca",
//       "antelope",
//       "ape",
//       "armadillo",
//       "baboon",
//       "badger",
//       "bat",
//       "bear",
//       "beaver",
//       "bison",
//       "boar",
//       "buffalo",
//       "bull",
//       "camel",
//       "canary",
//       "capybara",
//       "cat",
//       "chameleon",
//       "cheetah",
//       "chimpanzee",
//       "chinchilla",
//       "chipmunk",
//       "cougar",
//       "cow",
//       "coyote",
//       "crocodile",
//       "crow",
//       "deer",
//       "dingo",
//       "dog",
//       "donkey",
//       "dromedary",
//       "elephant",
//       "elk",
//       "ewe",
//       "ferret",
//       "finch",
//       "fish",
//       "fox",
//       "frog",
//       "gazelle",
//       "gila monster",
//       "giraffe",
//       "gnu",
//       "goat",
//       "gopher",
//       "gorilla",
//       "grizzly bear",
//       "ground hog",
//       "guinea pig",
//       "hamster",
//       "hedgehog",
//       "hippopotamus",
//       "hog",
//       "horse",
//       "hyena",
//       "ibex",
//       "iguana",
//       "impala",
//       "jackal",
//       "jaguar",
//       "kangaroo",
//       "koala",
//       "lamb",
//       "lemur",
//       "leopard",
//       "lion",
//       "lizard",
//       "llama",
//       "lynx",
//       "mandrill",
//       "marmoset",
//       "mink",
//       "mole",
//       "mongoose",
//       "monkey",
//       "moose",
//       "mountain goat",
//       "mouse",
//       "mule",
//       "muskrat",
//       "mustang",
//       "mynah bird",
//       "newt",
//       "ocelot",
//       "opossum",
//       "orangutan",
//       "oryx",
//       "otter",
//       "ox",
//       "panda",
//       "panther",
//       "parakeet",
//       "parrot",
//       "pig",
//       "platypus",
//       "polar bear",
//       "porcupine",
//       "porpoise",
//       "prairie dog",
//       "puma",
//       "rabbit",
//       "raccoon",
//       "ram",
//       "rat",
//       "reindeer",
//       "reptile",
//       "rhinoceros",
//       "salamander",
//       "seal",
//       "sheep",
//       "shrew",
//       "silver fox",
//       "skunk",
//       "sloth",
//       "snake",
//       "squirrel",
//       "tapir",
//       "tiger",
//       "toad",
//       "turtle",
//       "walrus",
//       "warthog",
//       "weasel",
//       "whale",
//       "wildcat",
//       "wolf",
//       "wolverine",
//       "wombat",
//       "woodchuck",
//       "yak",
//       "zebra"
//     ];

const animals = [`test`];

const QUESTION_DELAY = 2000; // in milliseconds

// The current answer to display (used initially to display the instructions)
let currentAnswer = `Click to begin.`;
// The current animal name the user is trying to guess
let currentAnimal = `...`;
// the player's score
let score = 0
// accent
let voice = "UK English Female"

var parameters = {
  onend: voiceEndCallback
}

/**
Create a canvas
Set up annyang with the guessing command
Set text defaults
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  // checks if annyang available
  if (annyang) {
    // Create the guessing command
    let commands = {
      "is it *animal": guessAnimal,
      //"next": nextQuestion,
      "ok": nextQuestion,
      //"go": nextQuestion,
      "skip": nextQuestion,
      "help": help,
    };
    annyang.addCommands(commands);
    annyang.start();
  }
  // Default text
  textSize(100);
  textAlign(CENTER);
  textFont("courier");
}

/**
Display the current answer.
 */
function draw() {
  background(0);

  displayAnswer();
}

/**
Display the current answer in red if incorrect and green if correct
(Displays nothing if no guess entered yet)
*/
function displayAnswer() {
  if (currentAnswer === currentAnimal) {
    fill(0, 255, 0);
  } else {
    fill(255);
  }
  text(currentAnswer, width / 2, height / 2);

  push();
  textSize(24);
  //display the score
  fill(255);
  text(score, 100, 100);
  pop();
}

/**
spell out the animal with ResponsiveVoice when commanded
*/
function help(){
  let splitAnimal = splitString(currentAnimal);
  responsiveVoice.speak(splitAnimal, voice);
}

/**
Reverse the animal name and say it with ResponsiveVoice
*/
function sayAnimalBackwards(animal) {
  let reverseAnimal = reverseString(animal);
  responsiveVoice.speak(reverseAnimal, voice);
}

/**
Reverses the provided string
*/
function reverseString(string) {
  let characters = string.split("");
  let reverseCharacters = characters.reverse();
  let result = reverseCharacters.join("");
  return result;
}

/**
splits the provided string into separate characters
*/
function splitString(string) {
  let characters = string.split("");
  let reverseCharacters = characters.reverse();
  // Adds a period to the end of each character in the array
  let spacedCharacters = reverseCharacters.map(i => `.` + i)
  let result = spacedCharacters.join("");
  return result;
}

/**
Called by annyang when the user make a guess.
animal parameter contains the guess as a string.
Sets the answer text to the guess.
*/
function guessAnimal(animal) {
  // Convert the guess to lowercase to match the answer format
  currentAnswer = animal.toLowerCase();

  // calls the correct() or incorrect() function
  if (currentAnswer === currentAnimal){
    correct();
  }
  else {
    incorrect();
  }
}

/**
Increases score if the answer is correct and says the guess was correct.
*/
function correct(){
  let responses = [`yes! `, `That's it. `, `yup. `, `You got it. `, `good job. `]
  let randResponse = random(responses);
  responsiveVoice.speak(randResponse + currentAnswer + ` is correct.`, voice, parameters);
  score++
}

/**
Tells the user they guess was wrong.
*/
function incorrect(){
  let responses = [`no.`, `nope.`, `no, that's wrong.`, `no, try again.`, `no, it is not.`, `thats not it.`]
  let randResponse = random(responses);
  responsiveVoice.speak(randResponse, voice);
}

/**
calls nextQuestion() after a the player guesses correctly and a delay
*/
function voiceEndCallback(){
  console.log(`voice ended`);
  setTimeout(nextQuestion, 1000)
;}

/**
Reset the answer text, get a new random animal, say its name
*/
function nextQuestion() {
  currentAnswer = `is it ___?`;
  currentAnimal = random(animals);
  sayAnimalBackwards(currentAnimal);
}

/**
When the user clicks, go to the next question or repeat current animal
*/
function mousePressed() {
  console.log(`score: ` + score);
  if (currentAnswer === currentAnimal || currentAnimal === `...`) {
    nextQuestion();
  } else {
    sayAnimalBackwards(currentAnimal);
  }
}

function keyPressed(){
  if (keyCode === 32){
    currentAnswer = currentAnimal;
  }
}
