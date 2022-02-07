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

/**
Starts the webcam and the Handpose, creates a bubble object
*/
function setup() {
  // canvas is same resolution as webcam
  createCanvas(640, 480);
  pixelDensity(1);

  // Start webcam and hide the resulting HTML element
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

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

  // Our bubble
  bubble = {
    x: random(width),
    y: height,
    size: 100,
    vx: 0,
    vy: -2,
  };
}

function draw() {
  background(0);
  // draw the webcam mirrored
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

  // draw ellipses over the detected keypoints
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      //draw the keypoints
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint[0], keypoint[1], 10, 10);

      // Check if the keypoints are touching the bubble
      let d = dist(keypoint[0], keypoint[1], bubble.x, bubble.y);
      if (d < bubble.size / 2) {
        // Pop!
        resetBubble();
      }
    }
  }

  // Handle the bubble's movement and display (independent of hand detection
  // so it doesn't need to be inside the predictions check)
  moveBubble();
  checkOutOfBounds();
  displayBubble();
}

/**
Resets the bubble to the bottom of the screen in a new x position
*/
function resetBubble() {
  bubble.x = random(width);
  bubble.y = height;
}

/**
Moves the bubble according to its velocity
*/
function moveBubble() {
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;
}

/**
Resets the bubble if it moves off the top of the canvas
*/
function checkOutOfBounds() {
  if (bubble < 0) {
    resetBubble();
  }
}

/**
Displays the bubble as a circle
*/
function displayBubble() {
  push();
  noStroke();
  fill(100, 100, 200, 150);
  ellipse(bubble.x, bubble.y, bubble.size);
  pop();
}
