let balloons = [];
let score = 0;
let timer = 5;
//let startTime;
let gameRunning = true;
let timerStarted = false;

function setup() {
  createCanvas(800, 600);
  startTime = millis();

  // Disable the context menu on right-click
    document.addEventListener('contextmenu', event => event.preventDefault());

  // Create initial balloons
  for (let i = 0; i < 5; i++) {
    balloons.push(new Balloon(random(100, width - 100), height + random(100, 200)));
  }
}

function draw() {
  background(255, 228, 196);

  // Check if time is up
  //if (millis() - startTime > timer) {
  //  textSize(32);
   // fill(0);
    //text("Time's up! Final Score: " + score, width / 2 - 100, height / 2);
    //noLoop(); // Stop the game loop
    //return;
  //}

  // Draw and update balloons
  for (let i = balloons.length - 1; i >= 0; i--) {
    balloons[i].move();
    balloons[i].show();
    if (balloons[i].popped || balloons[i].y < -balloons[i].r) {
      balloons.splice(i, 1); // Remove popped balloons or balloons that moved out of the screen
      balloons.push(new Balloon(random(100, width - 100), height + random(100, 200))); // Add new balloon at the bottom
    }
  }

  // Display the timer
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Black text
  text('Time: ' + timer, width / 2, 50);

  // Display score
  textSize(24);
  fill(0);
  text("Score: " + score, 100, 100);

  if (!gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Finish!', width / 2, height / 2);
    noLoop();
    gameCompleted({'score':score})
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

function mousePressed() {
  if (!timerStarted && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      timerStarted = true;
      setInterval(decreaseTimer, 1000);
  }

  for (let balloon of balloons) {
    if (balloon.isClicked(mouseX, mouseY)) {
      if (mouseButton === LEFT && balloon.popType === 'left') {
        balloon.pop();
        score += 10;
      } else if (mouseButton === RIGHT && balloon.popType === 'right') {
        balloon.pop();
        score += 20;
      }
    }
  }
}

function doubleClicked() {
  for (let balloon of balloons) {
    if (balloon.isClicked(mouseX, mouseY) && balloon.popType === 'double') {
      balloon.pop();
      score += 50;
    }
  }
}

class Balloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 50; // Radius of the balloon
    this.popped = false;
    this.speed = random(0.5, 1.5); // Speed of the balloon

    // Randomly assign a pop type and corresponding color
    const popTypes = ['left', 'right', 'double'];
    this.popType = random(popTypes);

    if (this.popType === 'left') {
      this.color = color(0, 255, 0); // Green for left click
    } else if (this.popType === 'right') {
      this.color = color(0, 0, 255); // Blue for right click
    } else if (this.popType === 'double') {
      this.color = color(255, 0, 0); // Red for double click
    }
  }

  move() {
    this.y -= this.speed; // Move the balloon up
  }

  show() {
    if (!this.popped) {
      fill(this.color);
      ellipse(this.x, this.y, this.r * 2);

      // Draw the text inside the balloon
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      text(this.popType.toUpperCase(), this.x, this.y);
    }
  }

  isClicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }

  pop() {
    this.popped = true;
  }
}
