class ClickingGame {
  constructor(canvasId, totalDuration, leftPhaseDuration, rightPhaseDuration) {
    this.canvasId = canvasId;
    this.totalDuration = totalDuration;
    this.leftPhaseDuration = leftPhaseDuration;
    this.rightPhaseDuration = rightPhaseDuration;

    this.targetX = 0;
    this.targetY = 0;
    this.score = 0;
    this.timer = totalDuration;
    this.gameRunning = true;
    this.circleSize = 80;
    this.glowAmount = 0;
    this.originalColor = null;
    this.glowColor = null;
    this.phase = 'LEFT'; // 'LEFT' or 'RIGHT'

    this.setup();
  }

  setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent(this.canvasId);
    setInterval(() => this.decreaseTimer(), 1000);

    // Disable the context menu on right-click
    canvas.elt.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Initialize target position
    this.targetX = width / 2;
    this.targetY = height / 2;

    // Define colors
    this.originalColor = color(255, 69, 0); // Red color
    this.glowColor = color(125, 0, 0, 100); // Yellow color with transparency
  }

  draw() {
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
    let instruction = ' click inside the circle!';
    if (this.phase === 'LEFT') {
      fill(50, 205, 50); // Green for LEFT
      text('LEFT' + instruction, width / 2, 150);
    } else {
      fill(255, 69, 0); // Red for RIGHT
      text('RIGHT' + instruction, width / 2, 150);
    }

    if (!this.gameRunning) {
      textSize(32);
      fill(0); // Black text
      text('Game Over!', width / 2, height / 2);
    }
  }

  mousePressed() {
    if (this.gameRunning && this.isInsideCircle(mouseX, mouseY, this.targetX, this.targetY, this.circleSize)) {
      if ((this.phase === 'LEFT' && mouseButton === LEFT) || (this.phase === 'RIGHT' && mouseButton === RIGHT)) {
        this.score++;
        this.glowAmount = 20; // Start the glow effect
      }
    }
  }

  decreaseTimer() {
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
  }

  updateGlowEffect() {
    if (this.glowAmount > 0) {
      this.glowAmount--;
      noFill();
      stroke(this.glowColor);
      strokeWeight(8 - this.glowAmount / 2); // Decrease glow intensity over time
      ellipse(this.targetX, this.targetY, this.circleSize + 20);
    }
  }

  drawTarget() {
    noStroke();
    fill(this.originalColor);
    ellipse(this.targetX, this.targetY, this.circleSize);
  }

  isInsideCircle(px, py, cx, cy, diameter) {
    let d = dist(px, py, cx, cy);
    return d < diameter / 2;
  }
}
