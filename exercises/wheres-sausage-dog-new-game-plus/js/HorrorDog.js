// horrorDog
// An extension of the Animal class
// only present in the horror game mode
// ends the game when found

class HorrorDog extends Animal {
  // Calls the super constructor
  // Adds properties for being found
  constructor (x, y, image) {
    super(x, y, image);

    this.found = false;
  }

  update(){
    super.update();

    }

}
