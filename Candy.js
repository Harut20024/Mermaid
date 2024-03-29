class Candy {
  constructor(x, y, img, hasIce) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.selected = false;
    this.hasIce = hasIce;
    this.type = this.assignType(img);
    this.iceSize = 90;
    this.moveIce = 0;
  }

  assignType(img) {
    let index = candyImages.indexOf(img);
    switch (index) {
      case 0:
        return "orange";
      case 1:
        return "blue";
      case 2:
        return "red";
      case 3:
        return "yellow";
      case 4:
        return "green";
      case 5:
        return "purple";
      default:
        return "unknown";
    }
  }
  display() {
    if (this.selected) {
      fill(255, 30, 30);
      rect(this.x + 5, this.y, 85, 89);
    }
    image(this.img, this.x, this.y, 90, 90);
    if (this.hasIce)
      image(
        iceCandy,
        this.x + this.moveIce,
        this.y + this.moveIce,
        this.iceSize,
        this.iceSize
      );
  }
}
