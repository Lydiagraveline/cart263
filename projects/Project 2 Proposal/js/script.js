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

  // create inital coral reef
  for (let i = 0; i < 10; i++){
    coral[0] = createCoral(510, 500, 50);
    coral[1] = createCoral(500, 810, 70);
    coral[2] = createCoral(520, 740, 40);
    coral[3] = createCoral(600, 550, 50)
    coral[4] = createCoral(510, 630, 85);
    coral[5] = createCoral(220, 490, 25);
    coral[6] = createCoral(250, 550, 20);
    coral[7] = createCoral(333, 410, 50);
    coral[8] = createCoral(300, 490, 50);
    coral[9] = createCoral(405, 500, 80);
    reef.push(coral[i]);
  }
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
