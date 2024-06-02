function ClickingGame(canvasId, totalDuration, leftPhaseDuration, rightPhaseDuration) {
  this.canvasId = canvasId;
  this.totalDuration = totalDuration;
  this.leftPhaseDuration = leftPhaseDuration;
  this.rightPhaseDuration = rightPhaseDuration;

  this.targetX = 0;
  this.targetY = 0;
  this.score = 0;
  this.timer = totalDuration;
  this.gameRunning = true;
  this.circleSize = 120;
  this.glowAmount = 0;
  this.originalColor = null;
  this.glowColor = null;
  this.phase = 'LEFT'; // 'LEFT' or 'RIGHT'
  this.firstClick = false;

  this.setup();
}

ClickingGame.prototype.setup = function() {
  var canvas = createCanvas(600, 400);
  canvas.parent(this.canvasId);

  // Disable the context menu on right-click
  canvas.elt.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Initialize target position
  this.targetX = width / 2;
  this.targetY = height / 2 + 50;

  // Define colors
  this.originalColor = color(255, 69, 0); // Red color
  this.glowColor = color(125, 0, 0, 100); // Yellow color with transparency
};

ClickingGame.prototype.startTimer = function() {
  if (!this.firstClick) {
    this.firstClick = true;
    setInterval(this.decreaseTimer.bind(this), 1000);
  }
};

ClickingGame.prototype.draw = function() {
  background(255, 228, 196); // Light orange background

  // Update and draw the target circle
  this.updateGlowEffect();
  this.drawTarget();

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
  text('clicking inside the circle for ' + this.leftPhaseDuration + ' seconds', width / 2 + 66, 150);

  if (!this.gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Finish!', width / 2, height / 2 + 35);
  }
};

ClickingGame.prototype.mousePressed = function() {
  if (this.gameRunning && this.isInsideCircle(mouseX, mouseY, this.targetX, this.targetY, this.circleSize)) {
    this.startTimer();
    if ((this.phase === 'LEFT' && mouseButton === LEFT) || (this.phase === 'RIGHT' && mouseButton === RIGHT)) {
      this.score++;
      this.glowAmount = 20; // Start the glow effect
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

ClickingGame.prototype.updateGlowEffect = function() {
  if (this.glowAmount > 0) {
    this.glowAmount--;
    noFill();
    stroke(this.glowColor);
    strokeWeight(8 - this.glowAmount / 2); // Decrease glow intensity over time
    ellipse(this.targetX, this.targetY, this.circleSize + 10);
  }
};

ClickingGame.prototype.drawTarget = function() {
  noStroke();
  fill(this.originalColor);
  ellipse(this.targetX, this.targetY, this.circleSize);
};

ClickingGame.prototype.isInsideCircle = function(px, py, cx, cy, diameter) {
  var d = dist(px, py, cx, cy);
  return d < diameter / 2;
};
