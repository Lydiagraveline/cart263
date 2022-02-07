/**
Bubble Popper
Lydia Graveline

Turns the index finger as seen through the webcam into a pin that can pop
a bubble that floats from the bottom of the screen to the top.

Uses:
ml5.js Handpose:
https://learn.ml5js.org/#/reference/handpose
*/

"use strict";

//the user's webcam
let video = undefined;
// The name of our model
let modelName = `Handpose`;
// Handpose object (using the name of the model for clarity)
let handpose;
// The current set of predictions made by Handpose once it's running
let predictions = [];

// The bubble we will be popping
let bubble;
// The pin
let pin = {
  tip: {
    x: undefined,
    y: undefined,
  },
  head: {
    x: undefined,
    y: undefined,
    size: 20,
  },
};

/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Start webcam and hide the resulting HTML element
  video = createCapture(VIDEO);
  video.hide();
  video.position(0, 0);

  // Load the Handpose model
  handpose = ml5.handpose(
    video,
    {
      flipHorizontal: true,
    },
    function () {
      console.log(`Model loaded.`);
    }
  );

  // Listen for predictions
  handpose.on(`predict`, function (results) {
    // console.log(results);
    predictions = results;
  });
}

function draw() {
  background(0);

  // Check if there currently predictions to display
  if (predictions.length > 0) {
    // If yes, then get the positions of the tip and base of the index finger
    updatePin(predictions[0]);

    // Display the current position of the pin
    displayPin();
  }
}

/**
Updates the position of the pin according to the latest prediction
*/
function updatePin(prediction) {
  pin.tip.x = prediction.annotations.indexFinger[3][0];
  pin.tip.y = prediction.annotations.indexFinger[3][1];
  pin.head.x = prediction.annotations.indexFinger[0][0];
  pin.head.y = prediction.annotations.indexFinger[0][1];
}

/**
Displays the pin based on the tip and base coordinates. Draws
a line between them and adds a red pinhead.
*/
function displayPin() {
  push();
  noFill();
  stroke(255);
  fill(255);
  line(pin.tip.x, pin.tip.y, pin.head.x, pin.head.y);
  pop();

  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(pin.head.x, pin.head.y, pin.head.size);
  pop();
}
