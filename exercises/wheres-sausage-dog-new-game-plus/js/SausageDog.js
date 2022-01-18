// SausageDog
// An extension of the Animal class
// Adds the idea of being found when clicked
// and runs away when found

class SausageDog extends Animal {
  // Calls the super constructor
  // Adds properties for being found, moving, speed, and for a random direction
  constructor(x, y, image){
    super(x, y, image);

    this.found = false;
    this.isMoving = false;
    this.speed = 5;
    this.rotationSpeed = 0.25;
  }

  // Calls the super update(), moves if found, and refreshes the game when sausage dog runs away
  update(){
    super.update();

    if (this.found){
      this.move();
    }

    let d = dist(mouseX, mouseY, this.x, this.y)
    if (!this.isMoving && d < 50){
      this.angle += this.rotationSpeed;
    } else if (this.isMoving) {
      this.angle = 0;
    }

    // refreshes the game when the sausage dog goes back into hiding
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height){
      refresh();
    }
  }

  // Move the sausage dog in a random direction and remember it is moving
  move(){
    this.isMoving = true;
    // Move the sausage dog in a random direction when found
    if (this.randomDirection === `up`){
      this.y -= this.speed
    }
    else if (this.randomDirection === `down`) {
      this.y += this.speed
    }
    else if (this.randomDirection === `left`) {
      this.x -= this.speed
    }
    else if (this.randomDirection === `right`) {
      this.x += this.speed
    }
  }

  // Checks if the sausage dog was clicked + increases score if found
  mousePressed(){
    if (!this.found && !this.isMoving && this.overlap(mouseX, mouseY)) {
      this.found = true;
      score += 1
      barkSFX.play();
      button1SFX.play();
    }
    // sets a random direction when clicked
    let directions = [`up`, `down`, `left`, `right`];
    this.randomDirection = random(directions);
    if (this.randomDirection === `left`){
      this.goingLeft = true;
    } else {
      this.goingLeft = false;
    }

  }
}
