class Coral {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.r = radius; // Circle radius
    this.rInit = radius; // initial radius (because it can grow)
    this.verts = random([20, 22, 24, 26, 28, 30]); // number of vetices that make up the circle
    this.nodes = []; // an array to store the vertices
    this.wobble = 50; //random(10, 100);  // How much the circle radius can vary
    this.smth = 500; //random(200, 500);  // How smooth the noise function is (higher is smoother)
    this.lineType = random([`thick`, `thin`]);
    // the color palette
    this.c =
      // the main color
      {
        r: random(87, 245), //r: random(130, 255),
        g: random(92, 191), //g: random(100, 130),
        b: random(75, 95), //b: random(100, 240),
      };
    this.c2 =
      //color of the line segments
      {
        r: random(130, 255),
        g: random(100, 255),
        b: random(100, 240),
        a: random(100, 255),
      };

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

  draw() {
    this.display();
    //this.lines();
    this.wobbleFunc();
    this.hover();
  }

  display() {
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
    }
    curveVertex(this.nodes[0].pos.x, this.nodes[0].pos.y)
    endShape();
    pop();
  }

  /**
  make the coral ~wobble~
  */
  wobbleFunc(){
     for(var i=0;i<this.nodes.length;i++){
      let f = noise(50*cos(i/this.verts*TWO_PI)/this.smth + t, 50*sin(i/this.verts*TWO_PI)/this.smth + t)
      let x = this.x + (this.r+this.wobble*f) * cos( (i/this.verts) *TWO_PI )
      let y = this.y + (this.r+this.wobble*f) * sin( (i/this.verts) * TWO_PI)

      this.nodes[i].pos.x = x
      this.nodes[i].pos.y = y
      }
  }

  /**
  Expand radius when mouse over
  */
  hover(){
    let d = dist(mouseX, mouseY, this.x, this.y)
    if (d < this.r+this.wobble && this.r <= this.rInit + 20){
      this.r++
    }else if (this.r > this.rInit && d > this.r+this.wobble){
      this.r --
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
