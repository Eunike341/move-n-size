var game;

function setup() {
  game = new ClickingGame('gameContainer', 6, 3, 3);
}

function draw() {
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}
