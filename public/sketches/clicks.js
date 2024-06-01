let targetX, targetY;
let score = 0;
let timer = 50;
let gameRunning = true;
let circleSize = 80;
let glowAmount = 0;
let originalColor;
let glowColor;
let phase = 'LEFT'; // 'LEFT' or 'RIGHT'

function setup() {
  createCanvas(600, 400);
  setInterval(decreaseTimer, 1000);

  // Disable the context menu on right-click
  canvas = document.getElementById('defaultCanvas0');
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Initialize target position
  targetX = width / 2;
  targetY = height / 2;

  // Define colors
  originalColor = color(255, 69, 0); // Red color
  glowColor = color(125, 0, 0, 100); // Yellow color with transparency
}

function draw() {
  background(255, 228, 196); // Light orange background

  // Update and draw the target circle
  updateGlowEffect();
  drawTarget();

  // Display the timer and score
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Black text
  text('Time: ' + timer, width / 2, 50);

  textSize(24);
  text('Score: ' + score, width / 2, 100);

  // Display instructions
  textSize(24);
  let instruction = ' click inside the circle!';
  if (phase === 'LEFT') {
    fill(50, 205, 50); // Green for LEFT
    text('LEFT' + instruction, width / 2, 150);
  } else {
    fill(255, 69, 0); // Red for RIGHT
    text('RIGHT' + instruction, width / 2, 150);
  }

  if (!gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Game Over!', width / 2, height / 2);
  }
}

function mousePressed() {
  if (gameRunning && isInsideCircle(mouseX, mouseY, targetX, targetY, circleSize)) {
    if ((phase === 'LEFT' && mouseButton === LEFT) || (phase === 'RIGHT' && mouseButton === RIGHT)) {
      score++;
      glowAmount = 20; // Start the glow effect
    }
  }
}

function decreaseTimer() {
  if (gameRunning) {
    if (timer > 0) {
      timer--;
      if (timer === 25) {
        phase = 'RIGHT'; // Switch to right click phase
      }
    } else {
      gameRunning = false;
    }
  }
}

function updateGlowEffect() {
  if (glowAmount > 0) {
    glowAmount--;
    noFill();
    stroke(glowColor);
    strokeWeight(8 - glowAmount / 2); // Decrease glow intensity over time
    ellipse(targetX, targetY, circleSize + 20);
  }
}

function drawTarget() {
  noStroke();
  fill(originalColor);
  ellipse(targetX, targetY, circleSize);
}

// Function to check if a point is inside the circle
function isInsideCircle(px, py, cx, cy, diameter) {
  let d = dist(px, py, cx, cy);
  return d < diameter / 2;
}
