/**
Project 2 Proposal - Coral Grief
Lydia Graveline

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

// empty array to store all the generated coral
let reef = [];

let coral = [];

/**
Description of setup
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

}

/**
creates a new coral object and sets it's parameters
*/
function createCoral(x, y){
 let coral = new Coral(
   x = x, //random(200, width-200),//x,
   y = y //random(200, height - 200),//y,
 );
  return coral;
}

/**
Description of draw()
*/
function draw() {
  background(250,236,222,255);

  // draw the coral reef
  for (let i = 0; i < reef.length; i++) {
    reef[i].draw()
  }
}

function mousePressed(){
  let corals = createCoral(mouseX, mouseY);
  reef.push(corals)
}
