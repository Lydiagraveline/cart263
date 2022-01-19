// Animal
// A class defining an animal that can be displayed as an image

class Animal {
  // Stores position and image as properties
  // Creates an angle property for potential rotation
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;

    this.angle = 0;
    this.goingLeft = false;
  }

  // Calls the display method
  update() {
    this.display();
  }

  // displays the animals
  display() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);

    // sausage dog flips if going left
    if (this.goingLeft && this.found) {
      scale(-1, 1);
    } else {
      scale(1, 1);
    }

    image(this.image, 0, 0);
    pop();
  }

  // Checks whether the position x,y is inside this animal's image
  // Returns: true if the click was inside the image and false otherwise
  overlap(x, y) {
    if (
      x > this.x - this.image.width / 2 &&
      x < this.x + this.image.width / 2 &&
      y > this.y - this.image.height / 2 &&
      y < this.y + this.image.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
