let puzzle;

function setup() {
  createCanvas(1200, 700); // Increase the canvas size
  let smallRects = [
    new Rectangle(50, 50, 80, 80, color(255, 0, 0)),
    new Rectangle(200, 50, 80, 80, color(0, 255, 0)),
    new Rectangle(350, 50, 80, 80, color(0, 0, 255)),
    new Rectangle(500, 50, 80, 80, color(255, 255, 0)),
    new Rectangle(650, 50, 80, 80, color(0, 255, 255)),
    new Rectangle(50, 150, 80, 80, color(255, 0, 255)),
    new Rectangle(200, 150, 80, 80, color(192, 192, 192)),
    new Rectangle(350, 150, 80, 80, color(128, 0, 0)),
    new Rectangle(500, 150, 80, 80, color(0, 128, 0)),
    new Rectangle(650, 150, 80, 80, color(100, 70, 120)),
  ];

  let guidelineColors = [
    color(255, 0, 0, 100),
    color(0, 255, 0, 100),
    color(0, 0, 255, 100),
    color(255, 255, 0, 100),
    color(0, 255, 255, 100),
    color(255, 0, 255, 100),
    color(192, 192, 192, 100),
    color(128, 0, 0, 100),
    color(0, 128, 0, 100),
    color(100, 70, 120, 100),
  ];

  puzzle = new Puzzle(50, 300, 800, 300, smallRects, guidelineColors, 2, 5);
}

function draw() {
  puzzle.display();
}

function mousePressed() {
  puzzle.mousePressed();
}

function mouseDragged() {
  puzzle.mouseDragged();
}

function mouseReleased() {
  puzzle.mouseReleased();
}

function mouseMoved() {
  puzzle.mouseMoved();
}

