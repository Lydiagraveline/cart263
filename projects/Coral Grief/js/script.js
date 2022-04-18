/**
Project 2 - Coral Grief
Lydia Graveline

Music by Jack Watkins

Coral Grief is an interactive manifesto inspired by the Crochet Coral Reef project
and feminist scholar Donna Haraway.
*/

"use strict";

// sound
let music;
let forward;
let back;

// text
let textJson; // JSON file containing all the lines of text
let textDisplay; // The text to be displayed derived from the JSON file
let lineNum = 0; // Current "line" of text from the JSON file to be displayed
let textColor; // The text color
let bg; // The background color
let fade = 0;
let fadeAmount = 2;

// coral
let reef = []; // empty array to store all the generated coral

let decay; // can be true or false //keeps track of coral that is actively decaying
let numDecay = 0; //The amount of coral that has decayed

/**
Preload the audio files + a JSON file
*/
function preload() {
  music = loadSound("assets/sounds/soundtrack.mp3");
  forward = loadSound("assets/sounds/forward.wav");
  back = loadSound("assets/sounds/back.wav");

  //JSON file
  textJson = loadJSON(`assets/data/text.json`);
}

/**
Creates the initial coral and plays the music
*/
function setup() {
  textColor = color(39, 57, 64, 255);
  bg = color(250, 236, 222, 255);
  createCanvas(windowWidth, windowHeight);
  // Play the music and make it loop
  music.loop();
  positionCoral(12);
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
      makeDecay(reef.length / 3);
    } else if (lineNum === 5) {
      makeDecay((2 * reef.length) / 3);
    } else if (lineNum === 6) {
      makeDecay(reef.length);
    } else if (lineNum === 7) {
      reef = [];
    }
    if (decay === true) {
      makeDecay(numDecay);
    }
  }

  textDisplay = `${textJson.line[lineNum]}`;
  fade += fadeAmount;

  // if (lineNum >= 0 && lineNum < 10) {
  //   textColor = color(39, 57, 64, 255);
  //   bg = color(250, 236, 222, 255);
  // } else if (lineNum >= 10) {
  //   textColor = color(171, 247, 255, fade);
  //   bg = color(39, 57, 64);
  // }

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
    text("Coral Grief", width / 2, height / 2 - 50);
    fill(39, 57, 64, fade);
    text(textDisplay, width / 2, height / 2 - 50);
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
  } else if (
    lineNum === 11 ||
    lineNum === 17 ||
    lineNum === 21 ||
    lineNum === 26
  ) {
    push();
    textSize(50);
    fill(textColor);
    text(textDisplay, width / 2, height / 2);
    pop();
  } else {
    push();
    textSize(18);
    textAlign(LEFT, CENTER);
    text(textDisplay, width / 5, height / 2);
    pop();
  }

  if (lineNum >= 10) {
    // background(39, 57, 64, fade);
  }

  // display the "next" and "back" text
  if (lineNum > 0) {
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

/**
Call the decay function for a specififed amount of coral in the reef
*/
function mousePressed() {
  fade = 0;
  if (lineNum >= 0 && lineNum < 33) {
    if (mouseX > width / 2) {
      lineNum++;
      //forward.play();

      // create new corals
      if (lineNum >= 8) {
        positionCoral(1); //create 1 new coral each time user clicks

          //if (!overlapping) {
            //let corals = createCoral(x, y, r);
            //reef.push(corals);
        //  }
        //}


        //make decay
        // if (lineNum >= 11) {
        //   let c = random(0, 1);
        //   if (c > 0.5) {
        //     decay = true;
        //     numDecay += 1;
        //   }
        // }
      }
    } else if (mouseX < width / 2 && lineNum > 0) {
      lineNum--;
      //back.play();
    }
  } else if (lineNum === 33) {
    lineNum = 0;
  }
}

/**
Generates a designated amount of coral (numCoral)
that won't overlap eachother or the text box
*/
function positionCoral(numCoral) {
  numCoral += reef.length

  // create inital coral reef without overlap
  while (reef.length < numCoral) {
    let coral = {
      x: random(width),
      y: random(height),
      r: random(50, 200),
    };
    // position the coral
    let overlapping = false;
    for (let j = 0; j < reef.length; j++) {
      // if two corals overlap eachother, set overlap to true
      let other = reef[j];
      let d = dist(coral.x, coral.y, other.x, other.y);
      if (d < coral.r + other.r) {
        overlapping = true;
      }
    }

    // if the coral spawns within the text box, set overlap = true
    if (
      coral.x >= width / 6 - coral.r &&
      coral.x <= width - width / 6 + coral.r &&
      coral.y >= height / 2 - 100 - coral.r &&
      coral.y <= height / 2 + 100 + coral.r
    ) {
      overlapping = true;
    }

    // If the coral dosn't overlap, add it to the reef
    if (!overlapping) {
      let corals = createCoral(coral.x, coral.y, coral.r);
      reef.push(corals);
    }
  }
}
