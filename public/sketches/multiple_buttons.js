let mouses = [];
let currentMouseIndex = 0;
let currentButtonType = 'left'; // 'left' or 'right'
let score = 0;
let timer = 30;
let gameRunning = true;
let numMouses = 5;

function setup() {
  createCanvas(600, 400);
  setInterval(decreaseTimer, 1000);

  // Disable the context menu on right-click
  canvas = document.getElementById('defaultCanvas0');
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Create mouse objects with random positions
  for (let i = 0; i < numMouses; i++) {
    let mouse = new MouseButton(i, random(50, 550), random(50, 350));
    mouses.push(mouse);
  }

  // Highlight the first button
  highlightCurrentButton();
}

function draw() {
  background(255, 228, 196); // Light orange background

  // Draw the mouse buttons
  mouses.forEach(mouse => mouse.draw());

  // Display the timer and score
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0); // Black text
  text('Time: ' + timer, width / 2, 50);

  textSize(24);
  text('Score: ' + score, width / 2, 100);

  if (!gameRunning) {
    textSize(32);
    fill(0); // Black text
    text('Game Over!', width / 2, height / 2);
  }
}

function mousePressed() {
  if (gameRunning) {
    let mouse = mouses[currentMouseIndex];
    if (currentButtonType === 'left' && mouse.isLeftClicked(mouseX, mouseY, mouseButton)) {
      score++;
      currentButtonType = 'right';
      highlightCurrentButton();
    } else if (currentButtonType === 'right' && mouse.isRightClicked(mouseX, mouseY, mouseButton)) {
      score++;
      currentMouseIndex++;
      if (currentMouseIndex === mouses.length) {
        randomizeMousePositions();
        currentMouseIndex = 0; // Reset to the first mouse
      }
      currentButtonType = 'left';
      highlightCurrentButton();
    } else {
      // wrongClicks++;
      // Handle wrong clicks if needed
    }
  }
}

function highlightCurrentButton() {
  mouses.forEach((mouse, i) => {
    if (i === currentMouseIndex) {
      mouse.highlight(currentButtonType);
    } else {
      mouse.removeHighlight();
    }
  });
}

function randomizeMousePositions() {
  mouses.forEach(mouse => {
    mouse.setPosition(random(50, 550), random(50, 350));
  });
}

function decreaseTimer() {
  if (gameRunning) {
    if (timer > 0) {
      timer--;
    } else {
      gameRunning = false;
      mouses.forEach(mouse => mouse.disable());
    }
  }
}

class MouseButton {
  constructor(index, x, y) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.size = 60;
    this.inactiveColor = color(135, 206, 250);
    this.activeColorLeft = color(50, 205, 50);
    this.activeColorRight = color(255, 69, 0);
    this.leftColor = this.inactiveColor;
    this.rightColor = this.inactiveColor;
    this.disabled = false;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    fill(135, 206, 250); // Light blue for mouse body
    rect(this.x - this.size / 2, this.y - this.size / 4, this.size, this.size / 2, 20);

    // Draw the left button
    fill(this.leftColor);
    rect(this.x - this.size / 2 + 5, this.y - this.size / 4 + 5, this.size / 2 - 10, this.size / 2 - 10, 10, 0, 0, 10);

    // Draw the right button
    fill(this.rightColor);
    rect(this.x, this.y - this.size / 4 + 5, this.size / 2 - 10, this.size / 2 - 10, 0, 10, 10, 0);
  }

  isLeftClicked(mx, my, button) {
    return !this.disabled && button === LEFT && mx > this.x - this.size / 2 + 5 && mx < this.x && my > this.y - this.size / 4 + 5 && my < this.y + this.size / 4 - 5;
  }

  isRightClicked(mx, my, button) {
    return !this.disabled && button === RIGHT && mx > this.x && mx < this.x + this.size / 2 - 5 && my > this.y - this.size / 4 + 5 && my < this.y + this.size / 4 - 5;
  }

  highlight(type) {
    if (type === 'left') {
      this.leftColor = this.activeColorLeft;
      this.rightColor = this.inactiveColor;
    } else {
      this.rightColor = this.activeColorRight;
      this.leftColor = this.inactiveColor;
    }
  }

  removeHighlight() {
    this.leftColor = this.inactiveColor;
    this.rightColor = this.inactiveColor;
  }

  disable() {
    this.disabled = true;
    this.removeHighlight();
  }
}
