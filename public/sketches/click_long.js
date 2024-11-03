var game;

function setup() {
  game = new ClickingGame('gameContainer', 30, 15, 15, 'fabble2');
}

function draw() {
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}
