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

let faceapi;
//the user's webcam
let video = undefined;
// The name of our model
let modelName = `Handpose`;
// Handpose object (using the name of the model for clarity)
let handpose;
// The current set of predictions made by Handpose once it's running
let predictions = [];
// The current set of detections made by faceapi once it's running
let detections = [];
// The bubble we will be popping
let bubble = undefined;
// Section of the webcam video containing the face, tracked by faceapi
let face;
// create graphics variable to store 3d objects
let pg;

// Create an empty array and assign it to the bubbles variable
let bubbles = [];
let numBubbles = 5; // Amount of bubbles in the game

/**
Starts the webcam and the Handpose, creates a bubble object
*/
function setup() {
  // canvas is same resolution as webcam
  createCanvas(640, 480);
  pg = createGraphics(200, 200, WEBGL);
  pg.rotateY(500);
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
      console.log(`Hand model loaded.`);
    }
  );

  // //load the faceapi model
  // faceapi = ml5.faceApi(
  //   video,
  //   function () {
  //     console.log(`Face model loaded.`);
  //   }
  // );

  // Listen for hand predictions
  handpose.on(`predict`, function (results) {
    // console.log(results);
    predictions = results;
  });

  // //Listen for face detections
  // faceapi.detect(updateFace);

  // Create bubbles at random positions
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i] = createBubble(random(200, width - 200), random(height, height + 300));
  }
}

/**
Updates the faceapi when the face is detected
*/
// function updateFace(error, result) {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   detections = result;
//   faceapi.detect(updateFace);
// }

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

function draw() {
  background(0);
  // draw the webcam mirrored
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

  //draw a box around the detected face
  if (detections.length > 0) {
    //drawBox(detections)
  }

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
  for (let i = 0; i < bubbles.length; i++) {
    moveBubble(bubbles[i]);
    checkOutOfBounds(bubbles[i]);
    displayBubble(bubbles[i]);
  }
}

/**
Resets the bubble to the bottom of the screen in a new x position
*/
function resetBubble() {
  //bubble.size = random(50, 200);
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
  //  pg.background(255);
  pg.noStroke();
  pg.texture(video);
  pg.sphere(85);
  image(pg, bubble.x, bubble.y, bubble.size, bubble.size);
  pop();
}

/**
Displays a box around the detected face
*/
function drawBox(detections) {
  for (let i = 0; i < detections.length; i++) {
    const alignedRect = detections[i].alignedRect;
    let x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight = alignedRect._box._height;

    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);
    rect(x, y, boxWidth, boxHeight);

    //let face = get(x, y, boxWidth, boxHeight);
    //image(face, 0, 0, 100, 100);
  }
}
