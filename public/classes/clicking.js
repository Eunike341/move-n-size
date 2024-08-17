function ClickingGame(canvasId, totalDuration, leftPhaseDuration, rightPhaseDuration, characterFile) {
  this.canvasId = canvasId;
  this.totalDuration = totalDuration;
  this.leftPhaseDuration = leftPhaseDuration;
  this.rightPhaseDuration = rightPhaseDuration;

  this.targetX = 0;
  this.targetY = 0;
  this.score = 0;
  this.timer = totalDuration;
  this.gameRunning = true;
  this.characterSize = 200;
  this.characterImage = null;
  this.phase = 'LEFT'; // 'LEFT' or 'RIGHT'
  this.firstClick = false;
  this.characterFile = characterFile;

  this.setup();
}

ClickingGame.prototype.setup = function() {
  var canvas = createCanvas(600, 400);
  canvas.parent(this.canvasId);

  // Disable the context menu on right-click
  canvas.elt.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Load character image
  this.characterImage = loadImage('images/'+ this.characterFile + '.png');

  // Initialize target position
  this.targetX = width / 2;
  this.targetY = height / 2 + 70;
};

ClickingGame.prototype.startTimer = function() {
  if (!this.firstClick) {
    this.firstClick = true;
    setInterval(this.decreaseTimer.bind(this), 1000);
  }
};

ClickingGame.prototype.draw = function() {
  background(255, 240, 235); // Light orange background

  // Draw the character
  this.drawCharacter();

  // Display the timer and score
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Black text
  text('Time: ' + this.timer, width / 2, 50);

  textSize(24);
  text('Score: ' + this.score, width / 2, 100);

  // Display instructions
  textSize(24);
  fill(0);
  text('Keep ', width / 2 - 244, 150);
  if (this.phase === 'LEFT') {
    fill(50, 205, 50); // Green for LEFT
    text('LEFT', width / 2 - 177, 150);
  } else {
    fill(255, 69, 0); // Red for RIGHT
    text('RIGHT', width / 2 - 177, 150);
  }
  fill(0);
  text('clicking on the character for ' + this.leftPhaseDuration + ' seconds', width / 2 + 70, 150);

  if (!this.gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Finish!', width / 2, height / 2 + 35);
    gameCompleted({'clicked': this.score});
  }
};

ClickingGame.prototype.mousePressed = function() {
  if (this.gameRunning && this.isInsideCharacter(mouseX, mouseY, this.targetX, this.targetY, this.characterSize)) {
    this.startTimer();
    if ((this.phase === 'LEFT' && mouseButton === LEFT) || (this.phase === 'RIGHT' && mouseButton === RIGHT)) {
      this.score++;
      this.characterReact(); // Make the character react to clicks
    }
  }
};

ClickingGame.prototype.decreaseTimer = function() {
  if (this.gameRunning) {
    if (this.timer > 0) {
      this.timer--;
      if (this.phase === 'LEFT' && this.timer === this.totalDuration - this.rightPhaseDuration) {
        this.phase = 'RIGHT'; // Switch to right click phase
      }
    } else {
      this.gameRunning = false;
    }
  }
};

ClickingGame.prototype.drawCharacter = function() {
  image(this.characterImage, this.targetX - this.characterSize / 2, this.targetY - this.characterSize / 2, this.characterSize, this.characterSize);
};

ClickingGame.prototype.isInsideCharacter = function(px, py, cx, cy, size) {
  var d = dist(px, py, cx, cy);
  return d < size / 2;
};

ClickingGame.prototype.characterReact = function() {
  // Add simple animation or reaction for the character
  this.characterSize = 240; // Temporarily increase the size
  setTimeout(() => {
    this.characterSize = 200; // Reset to original size
  }, 100);
};
