let leftScore = 0;
let rightScore = 0;
let wrongClicks = 0;
let timer = 30;
let gameRunning = true;
let currentClick = ''; // Will be set randomly in setup
let targetX, targetY;

function setup() {
  createCanvas(400, 400);
  setInterval(decreaseTimer, 1000);

  // Disable the context menu on right-click
  canvas = document.getElementById('defaultCanvas0');
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Randomize the initial turn
  currentClick = random(['left', 'right']);

  // Initialize target position
  targetX = random(100, 300);
  targetY = random(100, 300);
}

function draw() {
  background(255, 228, 196); // Light orange background

  // Draw the mouse with vibrant left and right buttons
  drawMouse();

  // Display the timer
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Black text
  text('Time: ' + timer, width / 2, 50);

  // Display the scores on one line
  textSize(24);
  fill(0); // Black text
  text('Left: ' + leftScore + '  Right: ' + rightScore + '  Missed: ' + wrongClicks, width / 2, 100);

  // Display instructions for the current click
  textSize(24);
  if (currentClick === 'left') {
    fill(50, 205, 50); // Green for active
    text('LEFT', width / 2 - 112, 300);
    fill(0);
    text('click the moving star', width / 2 + 32, 300);
  } else {
    fill(255, 69, 0); // Red for active
    text('RIGHT', width / 2 - 115, 300);
    fill(0);
    text('click the moving star', width / 2 + 40, 300);
  }

  if (!gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Finish!', width / 2, height / 2);
  }

  // Move target
  moveTarget();
  drawTarget();
}

function mousePressed() {
  if (gameRunning) {
    if (dist(mouseX, mouseY, targetX, targetY) < 20) {
      if (currentClick === 'left' && mouseButton === LEFT) {
        leftScore++;
        currentClick = random(['left', 'right']);
      } else if (currentClick === 'right' && mouseButton === RIGHT) {
        rightScore++;
        currentClick = random(['left', 'right']);
      } else {
        wrongClicks++;
      }
      // Move target to new random position
      targetX = random(100, 300);
      targetY = random(100, 300);
    } else {
      wrongClicks++;
    }
  }
}

function decreaseTimer() {
  if (gameRunning) {
    if (timer > 0) {
      timer--;
    } else {
      gameRunning = false;
    }
  }
}

function drawMouse() {

}

function moveTarget() {
  // Update target position to create a moving effect
  targetX += random(-2, 2);
  targetY += random(-2, 2);

  // Constrain the target position within the canvas
  targetX = constrain(targetX, 100, 300);
  targetY = constrain(targetY, 100, 300);
}

function drawTarget() {
  fill(255, 215, 0); // Black target
  drawStar(targetX, targetY, 10, 20, 5);
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}