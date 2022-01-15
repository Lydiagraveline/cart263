// SausageDog
// An extension of the Animal class
// Adds the idea of being found when clicked
// and spinning when found

class SausageDog extends Animal {
  // Calls the super constructor
  // Adds properties for being found, for a rotation speed, and for a random direction
  constructor(x, y, image){
    super(x, y, image);

    this.found = false;
    this.rotationSpeed = 0.25;
    this.randomDirection;
  }

  // Calls the super update() and changes angle if found (to rotate!)
  update(){
    super.update();

    if (this.found){
      this.move()
    }

    // refreshes the game when the sausage dog goes back into hiding
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height){
      refresh();
    }
  }

  // Move the sausage dog in a random direction when found
  move(){
    if (this.randomDirection === `up`){
      this.y -= 1
    }
    else if (this.randomDirection === `down`) {
      this.y += 1
    }
    else if (this.randomDirection === `left`) {
      this.x -= 1
    }
    else if (this.randomDirection === `right`) {
      this.x += 1
    }

  }

  // Checks if the sausage dog was clicked
  mousePressed(){
    if (!this.found && this.overlap(mouseX, mouseY)) {
      this.found = true;
    }
    // sets a random direction when clicked
    let directions = [`up`, `down`, `left`, `right`];
    this.randomDirection = random(directions);
    if (this.randomDirection === `left`){
      this.goingLeft = true;
    } else {
      this.goingLeft = false;
    }
    console.log(this.randomDirection);
    console.log(this.goingLeft);
  }
}
