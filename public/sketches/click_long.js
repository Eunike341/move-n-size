var game;

function setup() {
  game = new ClickingGame('gameContainer', 40, 20, 20, 'fabble2');
}

function draw() {
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}
