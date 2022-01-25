/**
Blade Runner's Computer
Lydia Graveline

little experiment with Annyang
*/

"use strict";

let img;


function preload(){
  img = loadImage(`assets/images/`)
}
/**
Create a canvas
Set up annyang with the guessing command
*/
function setup() {
  createCanvas(windowWidth, windowHeight);
  // checks if annyang available
  if (annyang) {
    // Create the guessing command
    let commands = {
      "enhance": enhance,
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

function draw() {
  background(0);


}

function enhance(){

}
