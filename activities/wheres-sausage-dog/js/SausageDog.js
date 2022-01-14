// SausageDog
// An extension of the Animal class
// Adds the idea of being found when clicked
// and spinning when found

class SausageDog extends Animal {
  // Calls the super constructor
  // Adds properties for being found and for a rotation speed
  constructor(x, y, image){
    super(x, y, image);

    this.found = false;
    this.rotationSpeed = 0.25;
  }

  // Calls the super update() and changes angle if found (to rotate!)
  update(){
    super.update();
    if (this.found = true){
      this.angle += this.rotationSpeed;
    }
  }

  // Checks if this sausage dog was clicked and remembers it was found if so
  mousePressed(){
    if (!this.found && this.overlap(mouseX, mouseY)) {
        this.found = true;
    }
  }
}
