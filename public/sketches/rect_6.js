let puzzle;

function setup() {
  createCanvas(1200, 750); // Increase the canvas size
  let smallRects = [
    new Rectangle(50, 50, 100, 50, color(255, 0, 0)),
    new Rectangle(200, 50, 100, 50, color(0, 255, 0)),
    new Rectangle(350, 50, 100, 50, color(0, 0, 255)),
    new Rectangle(500, 50, 100, 50, color(255, 255, 0)),
    new Rectangle(650, 50, 100, 50, color(0, 255, 255)),
    new Rectangle(800, 50, 100, 50, color(255, 0, 255)),
  ];

  let guidelineColors = [
    color(255, 0, 0, 100),
    color(0, 255, 0, 100),
    color(0, 0, 255, 100),
    color(255, 255, 0, 100),
    color(0, 255, 255, 100),
    color(255, 0, 255, 100),
  ];

  puzzle = new Puzzle(50, 150, 800, 480, smallRects, guidelineColors, 2, 3);
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
