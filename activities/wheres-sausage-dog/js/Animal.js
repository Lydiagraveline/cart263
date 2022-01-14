// Animal
// A class defining an animal that can be displayed as an image

class Animal {
  // Stores position and image as properties
  // Creates an angle property for potential rotation
  constructor(x, y, image){
    this.x = x;
    this.y = y;
    this.image = image;

    this.angle = 0;
  }

  // Calls the display method
  update(){
    this.display();
  }

  // displays the animals
  display() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.image, 0, 0);
    pop();
  }
}
