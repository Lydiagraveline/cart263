/**
Project 2 - Coral Grief
Lydia Graveline

Music by Jack Watkins

Coral Grief is an interactive digital manifesto inspired by the Crochet Coral Reef project
and feminist scholar Donna Haraway.
*/

"use strict";

// sound
let state = `title`; //can be title, manifesto, or playground
let music;
let forwardSFX;
let backSFX;

// text
let textJson; // JSON file containing all the lines of text
let textDisplay; // The text to be displayed derived from the JSON file
let lineNum = 0; // Current "line" of text from the JSON file to be displayed
let textColor; // The text color
let bg; // The background color
let fade = 0;
let fadeAmount = 2;

let reefSize = 12;

let alive = [];
let newArray = [];

let hover = false;

// coral
let reef = []; // empty array to store all the generated coral
//let decaying = [];

let decay = false; // can be true or false //keeps track of coral that is actively decaying
let numDecay = 0; //The amount of coral that has decayed

/**
Preload the audio files + a JSON file
*/
function preload() {
  music = loadSound("assets/sounds/soundtrack.mp3");
  forwardSFX = loadSound("assets/sounds/forward.wav");
  backSFX = loadSound("assets/sounds/back.wav");

  //JSON file
  textJson = loadJSON(`assets/data/text.json`);
}

/**
Creates the initial coral and plays the music
*/
function setup() {
  if (state === `manifesto`) {
    lineNum = 3;
  }
  //decaying = reef.splice(0,1);
  textColor = color(39, 57, 64, 255);
  bg = color(250, 236, 222, 255);
  createCanvas(windowWidth, windowHeight);
  // Play the music and make it loop
  music.loop();
  positionCoral(reefSize);
}

/**
creates a new coral object and sets it's parameters
*/
function createCoral(x, y, radius, state) {
  let coral = new Coral(
    (x = x), //random(200, width-200),//x,
    (y = y), //random(200, height - 200),//y,
    (radius = radius),
    (state = `alive`)
  );
  return coral;
}

/**
Description of draw()
*/
function draw() {
  background(bg);

  if (state === `title` || state === `manifesto`) {
    displayText();
  } else if (state === `playground`) {
    lineNum = 33;
  }

  //draw the coral reef
  for (let i = 0; i < reef.length; i++) {
    reef[i].setup();
    reef[i].draw();

    if (reef[i].r <= -20) {
      reef[i].state = `dead`;
    }

    if (reef[i].state === `decaying` || reef[i].state === `dead`) {
      reef[i].decay();
    }
    if (reef[i].state === `dead`) {
      reef.splice(i, 1);
    }

    if (decay === true) {
      //console.log(decay);
      //makeDecay(numDecay);
    }
  }
}

function displayText() {
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
    textSize(50);
    text("Coral Grief", width / 2, height / 2 - 50);
    //text(textDisplay, width / 2, height / 2 - 50);
    textSize(40);
    fill(100, 100, 200, fade);
    text(textDisplay, width / 2, height / 2 - 35);
    //  textSize(35);
    //text("Playground", width /3, height/2);
    pop();
  } else if (lineNum === 3) {
    push();
    textSize(22);
    fill(39, 57, 64, fade);
    text(textDisplay, width / 2, height / 2);
    pop();
  } else if (
    lineNum === 10 ||
    lineNum === 16 ||
    lineNum === 20 ||
    lineNum === 25
  ) {
    push();
    textSize(50);
    fill(39, 57, 64, fade);
    //fill(textColor);
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
  if (lineNum >= 4) {
    push();
    fill(textColor);
    textSize(35);
    text("next", width - 70, height - 30);
    text("back", 70, height - 30);
    pop();
  }
}

function decayOnLineNum() {
  //on lines 4-6, make the coral decay
  if (lineNum === 4) {
    //makeDecay(reef.length / 3);
    deleteCoral(reefSize / 3);
  } else if (lineNum === 5) {
    //makeDecay((2 * reef.length) / 3);
    deleteCoral((2 * reefSize) / 3);
  } else if (lineNum === 6) {
    //makeDecay(reef.length);
    deleteCoral(reefSize);
  } else if (lineNum === 7) {
    reef = [];
  }
}

function deleteCoralOriginal() {
  //works in playground mode
  //create an array of coral that is currently alive
  let newArray = reef.filter(function (coral) {
    return coral.state === `alive`;
  });

  for (let i = 0; i < newArray.length; i++) {
    let n = newArray.length - 1;
    newArray[n].state = `decaying`;
  }
}

/**
Make a specififed amount of currently alive coral start to decay
*/
function deleteCoral(amount) {
  //create an array of coral that is currently alive
  newArray = reef.filter(function (coral) {
    return coral.state === `alive`;
  });

  for (let i = 0; i < amount; i++) {
    //let n = newArray.length
    newArray[i].state = `decaying`;
  }
  //  console.log(`newArray = ` + newArray.length )
  //  console.log(`reef = ` + reef.length )
}

function keyPressed() {}

function keyPressed() {
  if (state === `title`) {
    if (lineNum < 2) {
      forward();
    } else if (lineNum === 2) {
      if (keyCode === LEFT_ARROW) {
        state = `playground`;
      } else if (keyCode === RIGHT_ARROW) {
        forward();
      }
    }
  } else if (state === `manifesto`) {
    if (keyCode === LEFT_ARROW && lineNum > 3) {
      back();
    } else if (keyCode === RIGHT_ARROW) {
      forward();
    }
  } else if (state === `playground`) {
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      deleteCoral();
    }
  }
}

/**
Handle forward and back when user clicks on the left or right side of the screen
*/
function mousePressed() {
  fade = 0;

  if (state === `playground`) {
    let corals = createCoral(mouseX, mouseY, random(50, 90));
    reef.push(corals);
  }

  //handle mouse pressed during the title state
  if (state === `title` && lineNum < 2) {
    forward();
  } else if (lineNum === 2) {
    if (mouseX > width / 2) {
      forward(); //changes state to `manifesto` automatically because lineNum will = 3
    } else if (mouseX < width / 2 && lineNum > 0) {
      state = `playground`;
    }
  }

  if (lineNum >= 0 && lineNum < 32) {
    // if mouse is on RIGHT half of screen
    // if (mouseX > width / 2) {
    //   if (lineNum === 3 && state === `title`) {
    //     //state = `manifesto`;
    //     console.log(state);
    //   } else if (state === `manifesto`) {
    //     forward();
    //   }
    //
    //   // if mosuse is on LEFT half of screen
    // } else if (mouseX < width / 2 && lineNum > 0) {
    //   if (lineNum === 3 && state === `title`) {
    //     state = `playground`;
    //     console.log(state);
    //   } else if (state === `manifesto` && lineNum >= 4) {
    //     back(); // go back a line
    //   }
    // }
  }
  //refresh the page
  else if (lineNum === 32) {
    lineNum = 0;
  }
}

/**
Goes forward a line and creates a new coral
*/
function forward() {
  // go forward 1 line
  lineNum++;
  decayOnLineNum();
  if (lineNum >= 3) {
    state = `manifesto`;
  }
  // create new coral after line 8
  if (lineNum >= 8) {
    positionCoral(1); //create 1 new coral each time user clicks
  }
}

/**
Goes back a line and makes coral decay
*/
function back() {
  // go back 1 line
  lineNum--;
  // make coral decay when the user goes back a line after line 8
  if (lineNum >= 8) {
    deleteCoral(1);
  }
}

/**
Generates a designated amount of coral (numCoral)
that won't overlap eachother or the text box
*/
function positionCoral(numCoral) {
  numCoral += reef.length;

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
      let corals = createCoral(coral.x, coral.y, coral.r, 1);
      reef.push(corals);
    }
  }
}
