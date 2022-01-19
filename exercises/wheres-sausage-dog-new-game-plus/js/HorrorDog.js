// horrorDog
// An extension of the Animal class
// only present in the horror game mode
// ends the game when found

class HorrorDog extends Animal {
  // Calls the super constructor
  // Adds properties for being found and rotation speed (which is the negative of sausage dog's)
  constructor (x, y, image) {
    super(x, y, image);

    this.found = false;
    this.rotationSpeed = -0.25;
  }

  update(){
    super.update();

    // calculate hover and spin if true
    let d = dist(mouseX, mouseY, this.x, this.y)
    if (!this.isMoving && d < 50){
      this.angle += this.rotationSpeed;
    } else if (this.isMoving) {
      this.angle = 0;
    }

    }

  mousePressed(){
    if (!this.found && this.overlap(mouseX, mouseY)){
      this.found = true;
      state = `horrorEnd`
      growlSFX.play();
      buttonSFX.play();
    }
  }

}
