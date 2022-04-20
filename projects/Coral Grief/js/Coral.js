class Coral {
  constructor(x, y, radius, state) {
    this.x = x;
    this.y = y;
    this.r = 0; // Circle radius
    this.rInit = radius; // initial radius (because it can grow)
    this.verts = random([20, 22, 24, 26, 28, 30]); // number of vetices that make up the circle
    this.nodes = []; // an array to store the vertices
    this.points = []; // an array to store the center point and outside nodes
    this.wobble = 50; //random(10, 100);  // How much the circle radius can vary
    this.smth = 500; //random(200, 500);  // How smooth the noise function is (higher is smoother)
    this.strokeWeight = 1; //random(1, 8);  // set to trandom for more variation (runs slower)
    this.lineType = random([`thick`, `thin`]);
    this.showCircle = false; //random([true, false]); // set to true for more variation (runs slower)
    this.circleSize = random(10, 25);
    this.t = 1;
    this.fullGrown = false;
    this.state = state

    // the color palette
    //main color
    this.c = {
      r: random(87, 245), //r: random(130, 255),
      g: random(92, 191), //g: random(100, 130),
      b: random(75, 95), //b: random(100, 240),
    };
    // detail color
    this.c2 = {
      r: random(130, 255),
      g: random(100, 255),
      b: random(100, 240),
      a: random(100, 255),
    };

    this.bleached = {
      r: 242,//random(220, 255),
      g: 240,//random(230, 255),
      b: 240,//random(200, 255),
      a: random(100, 255),
    };

    this.bleached2 = {
      r: 217, //random(177, 199),
      g: 200, //random(167, 188),
      b: 191,//random(160, 169),
      a: random(100, 255),
    };

    // color fade
    this.decayRate = 1 //random(0.1, 0.08);
    this.isDecaying = false;
    this.amt = 0;
    this.from = color(this.c.r, this.c.g, this.c.b);
    this.from2 = color(this.c2.r, this.c2.g, this.c2.b);
    this.to = color(this.bleached.r, this.bleached.g, this.bleached.b);
    this.to2 = color(this.bleached2.r, this.bleached2.g, this.bleached2.b);

    // create the nodes
    for (let i = 0; i < this.verts; i++) {
      this.nodes.push(
        new Node(
          this.x + this.r * sin((TWO_PI * i) / this.verts),
          this.y + this.r * cos((TWO_PI * i) / this.verts)
        )
      );
    }
  }

  /**
  create a vector at the center of the coral and at the outermost nodes
  */
  setup() {
//this.c2 = this.c;

//this.from = color(this.c.r, this.c.g, this.c.b);
//this.to = color(this.bleached.r, this.bleached.g, this.bleached.b);

    for (let i = 0; i < this.nodes.length; i++) {
      for (let i = 0; i < 2; i++) this.points[0] = createVector(this.x, this.y);
      this.points[1] = createVector(this.nodes[i].pos.x, this.nodes[i].pos.y);
    }

    // When coral is spawned it grows untill full grown
    if (this.r <= this.rInit && this.fullGrown === false) {
      this.r += 0.5;
    } else if (this.r > this.rInit && !this.isDecaying) {
      this.fullGrown = true;
    }
  }

  /**
  run the coral functions
  */
  draw() {
    // display coral untill it decays
    if (this.r > -20) {
      this.body();
      this.details();
      this.wobbleFunc();
      if (this.fullGrown === true) {
        this.hover();
      }
    }
  }

  /**
  display the ellipse or the "body" of the coral
  */
  body() {
    push();
    fill(this.c.r, this.c.g, this.c.b);
    noStroke();

    // draw the circle
    beginShape();
    curveVertex(this.nodes[0].pos.x, this.nodes[0].pos.y);
    for (let i = 0; i < this.nodes.length; i++) {
      let x = this.nodes[i].pos.x;
      let y = this.nodes[i].pos.y;
      curveVertex(x, y);
      if (this.showCircle === true) {
        ellipse(x, y, this.circleSize);
      }
    }
    curveVertex(this.nodes[0].pos.x, this.nodes[0].pos.y);
    endShape();
    pop();

  }

  details() {
    if (this.lineType === `thick`) {
      fill(this.c2.r, this.c2.g, this.c2.b, this.c2.a);
      //fill(0);
      noStroke();
      beginShape();
      for (let i = 0; i < this.nodes.length; i++) {
        vertex(this.x, this.y);
        if (this.showCircle === true) {
          ellipse(this.nodes[i].pos.x, this.nodes[i].pos.y, this.circleSize);
        }
        vertex(this.nodes[i].pos.x, this.nodes[i].pos.y);
        i += 1;
        vertex(this.nodes[i].pos.x, this.nodes[i].pos.y);
        if (this.showCircle === true) {
          ellipse(this.nodes[i].pos.x, this.nodes[i].pos.y, this.circleSize);
        }
      }
      vertex(this.x, this.y);
      endShape();

      // The thin lines are divided up into multiple segments because I wanted
      // lines to "sqiggle" or "wave" like the body of the coral does, but I couldnt figure out a solution
    } else if (this.lineType === `thin`) {
      noFill();
      stroke(this.c2.r, this.c2.g, this.c2.b, this.c2.a);
      strokeWeight(this.strokeWeight);
      for (let i = 0; i < this.nodes.length; i++) {
        let x = this.nodes[i].pos.x;
        let y = this.nodes[i].pos.y;
        for (let i = 0; i < this.points.length - 1; i++) {
          const current = this.points[i],
            next = this.points[i + 1];
          const count = floor(this.rInit / 10); //floor(dist(this.x, this.y, x, y) / (20));
          const dir = createVector((x - this.x) / count, (y - this.y) / count);
          beginShape();
          for (let j = 0; j < count; j++) {
            let x = current.x + dir.x * j;
            let y = current.y + dir.y * j;
            vertex(x, y);
            if (this.showCircle === true) {
              ellipse(x, y, 10);
            }
          }
          if (this.showCircle === true) {
            ellipse(x, y, 10);
          }
          vertex(x, y); // here x & y = this.nodes[i].pos. (x/y)
          endShape();
        }
      }
    }
  }

  /**
  make the coral ~wobble~
  */
  wobbleFunc() {
    this.t += 0.01;
    for (var i = 0; i < this.nodes.length; i++) {
      let f = noise(
        (50 * cos((i / this.verts) * TWO_PI)) / this.smth + this.t,
        (50 * sin((i / this.verts) * TWO_PI)) / this.smth + this.t
      );
      let x =
        this.x + (this.r + this.wobble * f) * cos((i / this.verts) * TWO_PI);
      let y =
        this.y + (this.r + this.wobble * f) * sin((i / this.verts) * TWO_PI);

      this.nodes[i].pos.x = x;
      this.nodes[i].pos.y = y;
    }
  }

  decay() {
    this.fullGrown = false;
    this.isDecaying = true;

    this.r = this.r - this.decayRate

    this.amt += 0.005; //speed of color change

     this.c = {
     r: lerpColor(this.from, this.to, this.amt),
     g: lerpColor(this.from, this.to, this.amt),
     b: lerpColor(this.from, this.to, this.amt)
    }

    this.c2 = {
    r: lerpColor(this.from2, this.to2, this.amt),
    g: lerpColor(this.from2, this.to2, this.amt),
    b: lerpColor(this.from2, this.to2, this.amt)
   }

    // this.c2 = {
    //   r: map(this.r, 0, this.rInit, this.bleached.r, this.c ),
    //   g: map(this.r, 0, this.rInit, this.bleached.g, this.c ),
    //   b: map(this.r, 0, this.rInit, this.bleached.b, this.c ),
    // }

    //this.c2 = lerpColor(from, to, 0.33);
  }

  /**
  Expand radius when mouse over
  */
  hover() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.r + this.wobble && this.r <= this.rInit + 20) {
      this.r++;
    } else if (this.r > this.rInit && d > this.r + this.wobble) {
      this.r--;
    } else {
      this.r = this.r - 0.01; // coral will get smaller and smaller untill it decays
    }
  }
}

/**
The nodes
*/
function Node(x, y) {
  this.pos = createVector(x, y);
  this.wobble = createVector(0, 0);
}
