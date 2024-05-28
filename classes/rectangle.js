class Rectangle {
  constructor(x, y, w, h, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
  }

  display() {
    fill(this.col);
    rect(this.x, this.y, this.w, this.h);
    //fill(200, 0, 0);
    noFill();
    //noStroke();
    stroke(0, 0, 0); // Set the stroke color for the corner points
    strokeWeight(2); 
    let points = this.getScalePoints();
    for (let p of points) {
      rect(p.x - puzzle.cornerSize / 2, p.y - puzzle.cornerSize / 2, puzzle.cornerSize, puzzle.cornerSize);
    }
  }

  getScalePoints() {
    return [
      {x: this.x, y: this.y},                             // Top-left corner
      {x: this.x + this.w, y: this.y},                     // Top-right corner
      {x: this.x, y: this.y + this.h},                     // Bottom-left corner
      {x: this.x + this.w, y: this.y + this.h},             // Bottom-right corner
      {x: this.x + this.w / 2, y: this.y},                 // Top midpoint
      {x: this.x + this.w / 2, y: this.y + this.h},         // Bottom midpoint
      {x: this.x, y: this.y + this.h / 2},                 // Left midpoint
      {x: this.x + this.w, y: this.y + this.h / 2}          // Right midpoint
    ];
  }

  scale(point) {
    let dx = mouseX - this.x;
    let dy = mouseY - this.y;

    switch(point) {
      case 0: // Top-left corner
        this.w += this.x - mouseX;
        this.h += this.y - mouseY;
        this.x = mouseX;
        this.y = mouseY;
        break;
      case 1: // Top-right corner
        this.w = mouseX - this.x;
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;
      case 2: // Bottom-left corner
        this.w += this.x - mouseX;
        this.x = mouseX;
        this.h = mouseY - this.y;
        break;
      case 3: // Bottom-right corner
        this.w = mouseX - this.x;
        this.h = mouseY - this.y;
        break;
      case 4: // Top midpoint
        this.h += this.y - mouseY;
        this.y = mouseY;
        break;
      case 5: // Bottom midpoint
        this.h = mouseY - this.y;
        break;
      case 6: // Left midpoint
        this.w += this.x - mouseX;
        this.x = mouseX;
        break;
      case 7: // Right midpoint
        this.w = mouseX - this.x;
        break;
    }

    // Ensure minimum size
    this.w = max(this.w, puzzle.cornerSize);
    this.h = max(this.h, puzzle.cornerSize);
  }

  isInside(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }
}

