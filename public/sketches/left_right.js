let leftScore = 0;
let rightScore = 0;
let wrongClicks = 0;
let timer = 30;
let gameRunning = false;
let timerStarted = false;
let currentClick = '';

function setup() {
  createCanvas(400, 400);

  // Disable the context menu on right-click
  canvas = document.getElementById('defaultCanvas0');
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Randomize the initial turn
  currentClick = random(['left', 'right']);
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
    text('LEFT', width / 2 - 30, 300);
    fill(0); // Black text
    text('click', width / 2 + 28, 300);
  } else {
    fill(255, 69, 0); // Red for active
    text('RIGHT', width / 2 - 30, 300);
    fill(0); // Black text
    text('click', width / 2 + 36, 300);
  }

  if (!gameRunning && timerStarted ) {
    textSize(32);
    fill(0); // Black text
    text('Finish!', width / 2, 350);
    gameCompleted({'left':leftScore, 'right':rightScore, 'missed':wrongClicks});
  }
}

function mousePressed() {
  if (!timerStarted && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    timerStarted = true;
    gameRunning = true;
    setInterval(decreaseTimer, 1000);
  }

  if (gameRunning) {
    if (currentClick === 'left' && mouseButton === LEFT) {
      leftScore++;
      currentClick = random(['left', 'right']);
    } else if (currentClick === 'right' && mouseButton === RIGHT) {
      rightScore++;
      currentClick = random(['left', 'right']);
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
  // Draw the mouse body
  fill(135, 206, 250); // Light blue
  rect(width / 2 - 50, height / 2 - 45, 100, 120, 20);

  // Draw the left button
  if (currentClick === 'left') {
    fill(50, 205, 50); // Green for active
  } else {
    fill(135, 206, 250);
  }
  rect(width / 2 - 45, height / 2 - 40, 40, 40, 10, 0, 0, 10);

  // Draw the right button
  if (currentClick === 'right') {
    fill(255, 69, 0); // Red for active
  } else {
    fill(135, 206, 250);
  }
  rect(width / 2 + 5, height / 2 - 40, 40, 40, 0, 10, 10, 0);
}
