/**
Bubble Popper
Lydia Graveline

Turns the index finger as seen through the webcam into a pin that can pop
bubbles reflecting the webcam video floating from the bottom
of the screen to the top.

Uses:
ml5.js Handpose:
https://learn.ml5js.org/#/reference/handpose
*/

"use strict";

// total number of popping sound effects
const NUM_SOUND_EFFECTS = 7;
// array to store the bubble pop sound effects
let popsSFX = [];
// Current state of program
let state = `loading`; // loading, running
//the user's webcam
let video = undefined;
// The name of our model
let modelName = `Handpose`;
// Handpose object (using the name of the model for clarity)
let handpose;
// The current set of predictions made by Handpose once it's running
let predictions = [];
// The bubble we will be popping
let bubble = undefined;
// image of a bubble
let bubbleIMG;
// create graphics variable to store 3d objects
let pg;

// Create an empty array and assign it to the bubbles variable
let bubbles = [];
let numBubbles = 5; // Total number of bubbles
let numPopped = 0;

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
Preload sound effects and store them in an array
*/
function preload() {
  for (let i = 0; i < NUM_SOUND_EFFECTS; i++) {
    let pop = loadSound(`assets/sounds/pop${i}.wav`);
    popsSFX.push(pop);
  }

  bubbleIMG = loadImage(`assets/images/bubble.png`);
}

/**
Starts the webcam and the Handpose, creates a bubble array
*/
function setup() {
  // canvas is same resolution as webcam
  createCanvas(640, 480);
  pg = createGraphics(200, 200, WEBGL);
  pg.rotateY(500);
  //pixelDensity(1);

  // Start webcam and hide the resulting HTML element
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Load the Handpose model then switch to our running state
  handpose = ml5.handpose(
    video,
    {
      flipHorizontal: true,
    },
    function () {
      state = `running`;
    }
  );

  // Listen for hand predictions
  handpose.on(`predict`, function (results) {
    predictions = results;
  });

  // Create bubbles at random positions
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i] = createBubble(
      random(200, width - 200),
      random(height, height + 400)
    );
  }
}

/**
Create a new JavaScript Object describing a bubble and returns it
*/
function createBubble(x, y) {
  // The bubble
  bubble = {
    x: x,
    y: y,
    size: random(50, 175),
    vx: 0,
    speed: random(2, 6),
  };
  return bubble;
}

/**
Handles the states of the program: loading and running
*/
function draw() {
  if (state === `loading`) {
    loading();
  } else if (state === `running`) {
    running();
  }
}

/**
Displays a simple loading screen with the loading model's name
*/
function loading() {
  push();
  textSize(32);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(`Loading ${modelName}...`, width / 2, height / 2);
  pop();
}

/**
Displays the webcam and handles the bubbles
*/
function running() {
  background(0);
  // display the webcam mirrored
  push();
  let flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0);
  pop();

  // Call handle bubble popping
  // Handle the bubble's movement and display (independent of hand detection
  // so it doesn't need to be inside the predictions check)
  for (let i = 0; i < bubbles.length; i++) {
    handleBubblePop(bubbles[i]);
    moveBubble(bubbles[i]);
    checkOutOfBounds(bubbles[i]);
    displayBubble(bubbles[i]);
  }
}

/**
Detects the hand and if it has popped a bubble, then reset the bubble
*/
function handleBubblePop(bubble) {
  // Check if there currently predictions to display
  if (predictions.length > 0) {
    // If yes, then get the positions of the tip and base of the index finger
    updatePin(predictions[0]);

    // Check if the tip of the index finger is touching the bubble
    let d = dist(pin.tip.x, pin.tip.y, bubble.x, bubble.y);
    //console.log(d)
    if (d < bubble.size / 2) {
      // Pop!
      let popSFX = random(popsSFX);
      popSFX.play();
      resetBubble(bubble);
    }
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
Resets the bubble to the bottom of the screen in a new x position
*/
function resetBubble(bubble) {
  bubble.x = random(1 + bubble.size / 2, width - 1 - bubble.size / 2);
  bubble.y = height + bubble.size;
  bubble.size = random(50, 200);
  bubble.speed = random(2, 6);
}

/**
Moves the bubble according to its velocity and speed
*/
function moveBubble(bubble) {
  bubble.y -= bubble.speed;
  bubble.x += bubble.vx;
  //  bubble.x = constrain(bubble.x, bubble.size/2, width - bubble.size/2);

  // Choose whether to change direction
  let change = random(0, 1);
  if (change < 0.05) {
    bubble.vx = random(-bubble.speed, bubble.speed);
  }

  // Bounce off the left and right sides on the canvas
  if (bubble.x >= width - bubble.size / 2 || bubble.x <= bubble.size / 2) {
    bubble.vx = -bubble.vx;
  }
}

/**
Resets the bubble if it moves off the top of the canvas
*/
function checkOutOfBounds(bubble) {
  if (bubble.y <= -bubble.size) {
    resetBubble(bubble);
  }
}

/**
Displays the bubble as a circle
*/
function displayBubble(bubble) {
  push();
  pg.noStroke();
  pg.texture(video);
  pg.tint(255, 175);
  pg.sphere(85);
  pop();

  push();
  imageMode(CENTER);
  image(pg, bubble.x, bubble.y, bubble.size, bubble.size);
  image(bubbleIMG, bubble.x, bubble.y, bubble.size, bubble.size);
  pop();
}

/**
Displays the pin based on the tip and base coordinates. Draws
a line between them and adds a red pinhead.
*/
function displayPin() {
  // Draw pin
  push();
  stroke(255);
  strokeWeight(2);
  line(pin.tip.x, pin.tip.y, pin.head.x, pin.head.y);
  pop();

  // Draw pinhead
  push();
  fill(255, 0, 0);
  noStroke();
  ellipse(pin.head.x, pin.head.y, pin.head.size);
  pop();
}
