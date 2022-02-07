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


/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Start webcam and hide the resulting HTML element
  video = createCapture(VIDEO);
  video.hide();
  //video.position(0, 0);


  // Load the Handpose model
 handpose = ml5.handpose(video, {
   flipHorizontal: true
 }, function() {
    console.log(`Model loaded.`);
 });

 // Listen for predictions
 handpose.on(`predict`, function(results){
   console.log(results);
   predictions = results;
 });


}

/**
Description of draw()
*/
function draw() {

}
