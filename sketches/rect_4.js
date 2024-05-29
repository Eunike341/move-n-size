let puzzle;

function setup() {
  createCanvas(800, 600);
  let smallRects = [
    new Rectangle(50, 50, 100, 50, color(255, 0, 0)),
    new Rectangle(200, 50, 100, 50, color(0, 255, 0)),
    new Rectangle(350, 50, 100, 50, color(0, 0, 255)),
    new Rectangle(500, 50, 100, 50, color(255, 255, 0)),
  ];

  let guidelineColors = [
    color(255, 0, 0, 100),
    color(0, 255, 0, 100),
    color(0, 0, 255, 100),
    color(255, 255, 0, 100)
  ];

  puzzle = new Puzzle(width / 4, height / 4, 400, 300, smallRects, guidelineColors, 2, 2);
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

