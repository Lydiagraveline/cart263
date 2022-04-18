/**
Project 2 - Coral Grief
Lydia Graveline


*/

"use strict";

// empty array to store all the generated coral
let reef = [];

// empty array to store new coral
//let coral = [];

let music;
let forward;
let back;
let textJson;
let textDisplay;
let lineNum = 0;
let initCoral = 12; //number of coral the program starts with
let numCoral = 0;
let decay;
let numDecay = 0;

let fade = 0
let fadeAmount = 2
let textColor;
let bg;

function preload() {
  music = loadSound('assets/sounds/soundtrack.mp3');
  forward = loadSound('assets/sounds/forward.wav');
  back = loadSound('assets/sounds/back.wav');
  textJson = loadJSON(`assets/data/text.json`);
}
/**
Description of setup
*/
function setup() {
  textColor = color(39, 57, 64, 255);
  bg = color(250, 236, 222, 255);
  //lineNum = 26

  createCanvas(windowWidth, windowHeight);

  music.loop();

  //create inital coral reef
  while (reef.length < initCoral) {
    let coral = {
      x: random(width),
      y: random(height),
      r: random(50, 200),
    };

    let overlapping = false;

    for (let j = 0; j < reef.length; j++) {
      // if two corals overlap eachother, set overlap to true
      let other = reef[j];
      let d = dist(coral.x, coral.y, other.x, other.y);
      if (d < coral.r + other.r) {
        overlapping = true;
      }
    }
    // if the coral spawn where the text will be, set overlap = true
    if (
      coral.x >= width / 6 - coral.r &&
      coral.x <= width - width / 6 + coral.r &&
      coral.y >= height / 2 - 100 - coral.r &&
      coral.y <= height / 2 + 100 + coral.r
    ) {
      overlapping = true;
    }

    if (!overlapping) {
      reef.push(coral);
    }
  }

  for (var i = 0; i < reef.length; i++) {
    reef[i] = createCoral(reef[i].x, reef[i].y, reef[i].r);
  }
}

/**
creates a new coral object and sets it's parameters
*/
function createCoral(x, y, radius) {
  let coral = new Coral(
    (x = x), //random(200, width-200),//x,
    (y = y), //random(200, height - 200),//y,
    (radius = radius)
  );
  return coral;
}

/**
Description of draw()
*/
function draw() {
  background(bg);

  //draw the coral reef
  for (let i = 0; i < reef.length; i++) {
    reef[i].setup();
    reef[i].draw();
    //on lines 4-6, make the coral decay
    if (lineNum === 4) {
      makeDecay(initCoral/3);
    } else if (lineNum === 5) {
      makeDecay(2*initCoral/3);
    }
    else if (lineNum === 6) {
      makeDecay(initCoral);
    } else if (lineNum === 7){
      reef = [];
    }

    if (decay === true){
      makeDecay(numDecay);
    }

  }

  textDisplay = `${textJson.line[lineNum]}`;
  fade += fadeAmount;


  if (lineNum >= 0 && lineNum < 10){
    textColor = color(39, 57, 64, 255);
    bg = color(250, 236, 222, 255);
  } else if (lineNum >= 10){
    textColor = color(171, 247, 255, fade);
    bg = color(39, 57, 64)
  }

  fill(textColor);
  noStroke();
  textFont("Space Mono");
  textAlign(CENTER, TOP);

  if (lineNum === 0) {
    push();
    textSize(50);
    fill(39, 57, 64, fade);
    text(textDisplay, width / 2, height / 2 - 50);
    textSize(35);
    text("begin", width - 70, height - 30);
    pop();
  } else if (lineNum === 1) {
    push();
    textSize(50);
    text("Coral Grief", width / 2, height / 2  - 50);
    fill(39, 57, 64, fade);
    text(textDisplay, width / 2, height / 2  - 50);
    pop();
  } else if (lineNum === 2) {
    push();
    textSize(22);
    text(textDisplay, width / 2, height / 2);
    pop();
  } else if (lineNum === 3) {
    push();
    textSize(22);
    text(textDisplay, width / 2, height / 2);
    pop();
  } else if (lineNum === 11 || lineNum === 17 || lineNum === 21 || lineNum === 26){
    push();
    textSize(50);
    fill(textColor);
    text(textDisplay, width / 2, height / 2);
    pop();
  }
  else {
    push();
    textSize(18);
    textAlign(LEFT, CENTER);
    text(textDisplay, width / 5, height / 2);
    pop();
  }


  if (lineNum >= 10){
    // background(39, 57, 64, fade);
  }



  // display the "next" and "back" text
  if (lineNum > 0 ) {
    push();
    fill(textColor);
    textSize(35);
    text("next", width - 70, height - 30);
    text("back", 70, height - 30);
    pop();
  }
}

/**
Call the decay function for a specififed amount of coral in the reef
*/
function makeDecay(amount) {
  for (let i = 0; i < amount; i++) {
    reef[i].decay();
  }
}

function mousePressed() {
  fade = 0;
  // if (lineNum === 0){
  //   music.play();
  // }
  if (lineNum >= 0 && lineNum < 33) {
    if (mouseX > width / 2) {
      lineNum++;
      //forward.play();
      console.log(lineNum);

        if (lineNum >= 8) {
          numCoral += 1
          while (reef.length < numCoral){
          let x = random(width);
          let y = random(height);
          let r = random(50, 200);
          let overlapping = false;
          if (
            x >= width / 6 - r &&
            x <= width - width / 6 + r &&
            y >= height / 2 - 100 - r &&
            y <= height / 2 + 100 + r
          ) {
            overlapping = true;
          }
          if (!overlapping){
            let corals = createCoral(x, y, r);
            reef.push(corals);
          }
        }
        if (lineNum >= 11){
          let c = random(0, 1)
          if (c > 0.5){
            decay = true;
            numDecay += 1
            console.log(decay)
          }
        }
        }
    } else if (mouseX < width / 2 && lineNum > 0) {
      lineNum--;
      //back.play();
      console.log(lineNum);
    }
  } else if (lineNum === 33){
    lineNum = 0;
  }

  // let corals = createCoral(mouseX, mouseY);
  // reef.push(corals);
}
