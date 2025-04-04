let balloons = [];
let score = 0;
let timer = 45;
let gameRunning = true;
let timerStarted = false;

let leftBalloonImage, rightBalloonImage, doubleBalloonImage;

function preload() {
  leftBalloonImage = loadImage('images/balloon_left.png');
  rightBalloonImage = loadImage('images/balloon_right.png');
  doubleBalloonImage = loadImage('images/balloon_double.png');
}

function setup() {
  createCanvas(800, 400);
  startTime = millis();

  // Disable the context menu on right-click
    document.addEventListener('contextmenu', event => event.preventDefault());

  // Create initial balloons
  for (let i = 0; i < 7; i++) {
    let widthRange = random(70, width - 390);
    if (i%2===0) {
      widthRange = random(400, width - 100);
    }
    balloons.push(new Balloon(widthRange, height + random(100, 200)));
  }
}

function draw() {
  background(255, 240, 235);

  // Draw and update balloons
  for (let i = balloons.length - 1; i >= 0; i--) {
    balloons[i].move();
    balloons[i].show();
    if (balloons[i].popped || balloons[i].y < -balloons[i].r) {
      balloons.splice(i, 1); // Remove popped balloons or balloons that moved out of the screen
      let widthRange = random(70, width - 390);
      if (i%2===0) {
        widthRange = random(400, width - 100);
      }
      balloons.push(new Balloon(widthRange, height + random(100, 200)));
    }
  }

  // Display the timer
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Black text
  text('Time: ' + timer, width / 2, 50);

  // Display score
  textSize(20);
  fill(0);
  textAlign(LEFT, CENTER)
  text("LEFT/ RIGHT/ DOUBLE click on the balloons", 20, 90, 500);
  text("Score: " + score, 20, 120, 500);


  if (!gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Finish!', width / 2, height / 2);
    noLoop();
    gameCompleted({'clicked':score})
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
        score += 2;
        break;
      } else if (mouseButton === RIGHT && balloon.popType === 'right') {
        balloon.pop();
        score += 2;
        break;
      }
    }
  }
}

function doubleClicked() {
  console.log('double clicked');
  for (let balloon of balloons) {
    if ( balloon.popType === 'double' && balloon.isClicked(mouseX, mouseY) ) {
      console.log('double clicked popped');
      balloon.pop();
      score += 3;
      break;
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

    if (this.popType === 'double') {
        this.speed = random(0.5, 1); //double click balloon moves slower
    }

    if (this.popType === 'left') {
      this.image = leftBalloonImage;
    } else if (this.popType === 'right') {
      this.image = rightBalloonImage;
    } else if (this.popType === 'double') {
      this.image = doubleBalloonImage;
    }
  }

  move() {
    this.y -= this.speed; // Move the balloon up
  }

  show() {
    if (!this.popped) {

      if (this.popType === 'left') {
        image(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2 + 50);
      } else if (this.popType === 'right') {
        image(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2 + 45);
      } else if (this.popType === 'double') {
        image(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2 + 60);

      }
      fill(255);
      textSize(14);
      textAlign(CENTER, CENTER);
      text(this.popType.toUpperCase(), this.x, this.y);
    }
  }

  isClicked(px, py) {
    let imageWidth = this.r * 2; // The width of the balloon image
    let imageHeight;

    // Set height based on the balloon type
    if (this.popType === 'left') {
      imageHeight = this.r * 2 + 50;
    } else if (this.popType === 'right') {
      imageHeight = this.r * 2 + 45;
    } else if (this.popType === 'double') {
      imageHeight = this.r * 2 + 60;
    }

    // Check if the click is inside the rectangular bounds of the image
    return px >= (this.x - this.r) && px <= (this.x - this.r + imageWidth) &&
           py >= (this.y - this.r) && py <= (this.y - this.r + imageHeight);
  }


  pop() {
    this.popped = true;
  }
}
