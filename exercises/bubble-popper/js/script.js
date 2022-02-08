/**
Bubble Popper
Lydia Graveline

Lets the user use their hand as seen through the webcam to pop
bubbles on the screen.

Uses:
ml5.js Handpose:
https://learn.ml5js.org/#/reference/handpose
*/

"use strict";

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
// create graphics variable to store 3d objects
let pg;

// Create an empty array and assign it to the bubbles variable
let bubbles = [];
let numBubbles = 5; // Total number of bubbles

// The hand
let hand = {
  index: {
    x: undefined,
    y: undefined,
  },
  middle: {
    x: undefined,
    y: undefined,
  },
};

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
      random(height, height + 300)
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
    size: random(50, 100),
    vx: 0,
    speed: random(2, 4),
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
    updateHand(predictions[0]);

    // Check if the tip of the index finger is touching the bubble
    let d = dist(hand.index.x, hand.index.y, bubble.x, bubble.y);
    //console.log(d)
    if (d < bubble.size / 2) {
      // Pop!
      resetBubble(bubble);
    }
    // Display the current position of the fingers
    displayKeypoints();
  }
}

/**
Updates the position of the pin according to the latest prediction
*/
function updateHand(prediction) {
  hand.index.x = prediction.annotations.indexFinger[3][0];
  hand.index.y = prediction.annotations.indexFinger[3][1];
}

/**
Resets the bubble to the bottom of the screen in a new x position
*/
function resetBubble(bubble) {
  console.log(`pop!`)
  bubble.x = random(bubble.size, width - bubble.size);
  bubble.y = height;
}

/**
Moves the bubble according to its velocity and speed
*/
function moveBubble(bubble) {
  bubble.y -= bubble.speed;
  bubble.x += bubble.vx;

  // Choose whether to change direction
  let change = random(0, 1);
  if (change < 0.05) {
    bubble.vx = random(-bubble.speed, bubble.speed);
  }

  // Bounce off the left and right sides on the canvas
  if (bubble.x > width - bubble.size || bubble.x < 0) {
    bubble.vx = -bubble.vx;
  }
}

/**
Resets the bubble if it moves off the top of the canvas
*/
function checkOutOfBounds(bubble) {
  if (bubble.y <= -bubble.size) {
    //resetBubble();
    bubble.y = random(height, height + 300);
    bubble.x = random(bubble.size / 2, width - bubble.size / 2);
  }
}

/**
Displays the bubble as a circle
*/
function displayBubble(bubble) {
  push();
  //pg.background(255);
  pg.noStroke();
  pg.texture(video);
  pg.sphere(85);
  imageMode(CENTER);
  image(pg, bubble.x, bubble.y, bubble.size, bubble.size);
  pop();
}

/**
Displays the relevant keypoints on the hand
*/
function displayKeypoints() {
  // Draw index fingertip
  push();
  fill(255, 0, 0);
  noStroke();
  ellipse(hand.index.x, hand.index.y, 20);
  pop();
}
