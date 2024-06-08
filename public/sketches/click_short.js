var game;

function setup() {
  game = new ClickingGame('gameContainer', 6, 3, 3, 'fabble');
}

function draw() {
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}
