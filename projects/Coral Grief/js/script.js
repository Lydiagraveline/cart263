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
let subTextColor;
let amt, startColor, newColor; // background colors
let hover = false;
let fade = 0;
let fadeAmount = 2;

let reefSize = 12;

let alive = [];
let newArray = [];

// coral
let reef = []; // empty array to store all the generated coral
//let decaying = [];

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
  createCanvas(windowWidth, windowHeight);
  // Play the music and make it loop
  music.loop();
  positionCoral(reefSize);

  // background colors
  startColor = color(43, 49, 77);
  newColor = color(49, 86, 87);
  amt = 0;

  // text colors
  textColor = color(255);
  subTextColor = color(160, 220, 255);
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
Make the background fade between different random colors
*/
function backgroundColor() {
  background(lerpColor(startColor, newColor, amt));
  amt += 0.001;
  if (amt >= 1) {
    amt = 0.0;
    startColor = newColor;
    newColor = color(random(39, 49), random(49, 86), random(64, 87));
  }
}

/**
Handle the different states
and draw the coral
*/
function draw() {
  backgroundColor();
  subTextColor = color(160, 220, 255);

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
  }

  //handle the states
  if (state === `title` || state === `manifesto`) {
    displayText();
  } else if (state === `playground`) {
    lineNum = 33;
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
    newArray[i].state = `decaying`;
  }
}

/**
Handle keys pressed during specific states
*/
function keyPressed() {
  fade = 0; //reset fade
  //TITLE//
  //handle going forward a line and changing states
  if (state === `title`) {
    if (lineNum < 2) {
      forward();
    } else if (lineNum === 2) {
      if (keyCode === LEFT_ARROW) {
        state = `playground`;
      } else if (keyCode === RIGHT_ARROW) {
        forward(); //changes state to `manifesto` automatically because lineNum will = 3
      }
    }
    //MANIFESTO//
    //handle going forward and back a line
  } else if (state === `manifesto`) {
    if (keyCode === LEFT_ARROW) {
      if (lineNum > 3 && lineNum < 32) {
        back();
        // switch states
      } else if (lineNum === 32) {
        state = `playground`;
      }
    } else if (keyCode === RIGHT_ARROW) {
      if (lineNum < 32) {
        forward();
        // restart
      } else if (lineNum === 32) {
        lineNum = 3;
      }
    }
    //PLAYGROUND//
    // delete most recent coral
  } else if (state === `playground`) {
    if (keyCode === DELETE || keyCode === BACKSPACE) {
      deleteCoral(1);
    }
  }
}

/**
Handle mouse pressed during different states
*/
function mousePressed() {
  fade = 0; //reset fade

  //PLAYGROUND//
  // create a new coral where the user clicks
  if (state === `playground`) {
    let corals = createCoral(mouseX, mouseY, random(50, 90));
    reef.push(corals);
  }

  //TITLE//
  if (state === `title` && lineNum < 2) {
    forward();
  } else if (lineNum === 2) {
    if (mouseX > width / 2) {
      forward(); //changes state to `manifesto` automatically because lineNum will = 3
    } else if (mouseX < width / 2) {
      state = `playground`;
    }
  }
  //MANIFESTO//
  if (lineNum >= 0 && lineNum < 32) {
    //if mouse is on RIGHT half of screen
    if (mouseX > width / 2) {
      if (state === `manifesto`) {
        forward();
      }
      // if mosuse is on LEFT half of screen
    } else if (mouseX < width / 2) {
      if (state === `manifesto` && lineNum >= 3) {
        back(); // go back a line
      }
    }
  }
  //handle the end of the manifesto
  else if (lineNum === 32) {
    if (mouseX > width / 2) {
      //restart manifesto
      lineNum = 3;
    } else if (mouseX < width / 2 && lineNum > 0) {
      // switch to playground
      state = `playground`;
    }
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
Make coral decay on specific lines
*/
function decayOnLineNum() {
  //on lines 4-6, make the coral decay
  if (lineNum === 4) {
    //makeDecay(reef.length / 3);
    deleteCoral(reef.length / 3);
  } else if (lineNum === 5) {
    //makeDecay((2 * reef.length) / 3);
    deleteCoral(reef.length / 3);
  } else if (lineNum === 6) {
    //makeDecay(reef.length);
    deleteCoral(reef.length);
  } else if (lineNum === 7) {
    reef = [];
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

/**
Handle the text displayed on specific lines
*/
function displayText() {
  textDisplay = `${textJson.line[lineNum]}`;
  fade += fadeAmount;

  fill(textColor);
  noStroke();
  textFont("Space Mono");
  textAlign(CENTER, TOP);

  if (lineNum === 0) {
    push();
    textSize(50);
    fill(255, fade);
    text(textDisplay, width / 2, height / 2 - 50);
    textSize(35);
    pop();
  } else if (lineNum === 1) {
    push();
    textSize(50);
    text("Coral Grief", width / 2, height / 2 - 50);
    fill(255, fade);
    text(textDisplay, width / 2, height / 2 - 50);
    pop();
  } else if (lineNum === 2) {
    push();
    textSize(50);
    text("Coral Grief", width / 2, height / 2 - 50);
    textSize(40);

    //change text color on mouse over
    subTextColor = color(160, 220, 255, fade);
    if (mouseX > width / 2) {
      fill(255);
    } else {
      fill(subTextColor);
    }
    text(`Manifesto`, (2 * width) / 3, height / 2 + 15);
    if (mouseX < width / 2) {(2 * width) / 3
      fill(255);
    } else {
      fill(subTextColor);
    }
    text(`Playground`, width / 3, height / 2 + 15);
    pop();
  } else if (lineNum === 3) {
    push();
    textSize(22);
    fill(255, fade);
    text(textDisplay, width / 2, height / 2);
    subTextColor = color(160, 220, 255, fade);
    fill(subTextColor);
    textSize(35);
    text("next >", width - 70, height - 30);
    pop();
  } else if (lineNum === 4) {
    push();
    fill(subTextColor);
    textSize(35);
    text("next >", width - 70, height - 30);
    subTextColor = color(160, 220, 255, fade);
    textSize(18);
    textAlign(LEFT, CENTER);
    fill(255, fade);
    text(textDisplay, width / 5, height / 2);
    pop();
  } else if (lineNum === 32) {
    push();
    textSize(40);
    //change text color on mouse over
    subTextColor = color(160, 220, 255, fade);
    if (mouseX > width / 2) {
      fill(255);
    } else {
      fill(subTextColor);
    }
    text(`Manifesto`, (2 * width) / 3, height / 2 + 15);
    if (mouseX < width / 2) {(2 * width) / 3
      fill(255);
    } else {
      fill(subTextColor);
    }
    text(`Playground`, width / 3, height / 2 + 15);
    pop();
  } else if (
    lineNum === 10 ||
    lineNum === 16 ||
    lineNum === 20 ||
    lineNum === 25
  ) {
    push();
    textSize(50);
    fill(255, fade);
    text(textDisplay, width / 2, height / 2);
    pop();
  } else {
    push();
    textSize(18);
    textAlign(LEFT, CENTER);
    text(textDisplay, width / 5, height / 2);
    pop();
  }

  // display the "next" and "back" text
  if (lineNum >= 4) {
    push();
    textSize(35);
    if (mouseX > width / 2) {
      fill(255);
    } else {
      fill(subTextColor);
    }
    text("next >", width - 70, height - 30);
    if (mouseX < width / 2) {(2 * width) / 3
      fill(255);
    } else {
      fill(subTextColor);
    }
    text("< back", 70, height - 30);
    pop();
  }
}
