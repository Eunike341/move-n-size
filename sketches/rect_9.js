let puzzle;

function setup() {
  createCanvas(1200, 1200); // Increase the canvas size
  let smallRects = [
    new Rectangle(50, 50, 100, 100, color(255, 0, 0)),
    new Rectangle(200, 50, 100, 100, color(0, 255, 0)),
    new Rectangle(350, 50, 100, 100, color(0, 0, 255)),
    new Rectangle(500, 50, 100, 100, color(255, 255, 0)),
    new Rectangle(650, 50, 100, 100, color(0, 255, 255)),
    new Rectangle(50, 200, 100, 100, color(255, 0, 255)),
    new Rectangle(200, 200, 100, 100, color(192, 192, 192)),
    new Rectangle(350, 200, 100, 100, color(128, 0, 0)),
    new Rectangle(500, 200, 100, 100, color(0, 128, 0)),
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
  ];

  puzzle = new Puzzle(200, 320, 800, 800, smallRects, guidelineColors); // Adjust the big rectangle position and size
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

