class Animal {
  constructor(x, y, image){
    this.x = x;
    this.y = y;
    this.image = image;

    this.angle = 0;
  }

  // An update method that calls the display method
  update(){
    this.display();
  }

  // displays the animals
  dsiplay() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.image, 0, 0);
    pop();
  }
}
