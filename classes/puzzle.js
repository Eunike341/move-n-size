class Puzzle {
  constructor(bigRectX, bigRectY, bigRectW, bigRectH, smallRects, guidelineColors) {
    this.bigRect = new Rectangle(bigRectX, bigRectY, bigRectW, bigRectH, color(200, 200, 200));
    this.smallRects = smallRects;
    this.guidelines = [];
    this.placedOrder = [];
    this.cornerSize = 10;
    this.dragging = false;
    this.dragPoint = null;
    this.currentRect = null;

    // Define guidelines within the big rectangle (90% of the big rectangle size)
    let guidelineWidth = this.bigRect.w * 0.45;
    let guidelineHeight = this.bigRect.h * 0.45;
    
    for (let i = 0; i < guidelineColors.length; i++) {
      let row = Math.floor(i / 2);
      let col = i % 2;
      this.guidelines.push({
        x: this.bigRect.x + col * guidelineWidth,
        y: this.bigRect.y + row * guidelineHeight,
        w: guidelineWidth,
        h: guidelineHeight,
        col: guidelineColors[i]
      });
    }
  }

  display() {
    background(220);
    this.bigRect.display();
    this.drawGuidelines();
    
    for (let rect of this.smallRects) {
      rect.display();
    }
    if (this.dragging && this.dragPoint !== null && this.currentRect !== null) {
      this.currentRect.scale(this.dragPoint);
    }
    
    // Check if all rectangles are placed correctly based on location and size accuracy
    if (this.checkAllPlacements()) {
      fill(0, 255, 0);
      textSize(32);
      text('Correct Placement and Size!', 10, height - 20);
    } else {
      fill(255, 0, 0);
      textSize(32);
      text('Incorrect Placement or Size', 10, height - 20);
    }
  }

  drawGuidelines() {
    for (let guide of this.guidelines) {
      fill(guide.col);
      rect(guide.x, guide.y, guide.w, guide.h);
    }
  }

  mousePressed() {
    for (let i = 0; i < this.smallRects.length; i++) {
      let rect = this.smallRects[i];
      let points = rect.getScalePoints();
      for (let j = 0; j < points.length; j++) {
        let p = points[j];
        if (mouseX > p.x - this.cornerSize / 2 && mouseX < p.x + this.cornerSize / 2 &&
            mouseY > p.y - this.cornerSize / 2 && mouseY < p.y + this.cornerSize / 2) {
          this.dragging = true;
          this.dragPoint = j;
          this.currentRect = rect;
          return;
        }
      }
      if (rect.isInside(mouseX, mouseY)) {
        this.dragging = true;
        this.currentRect = rect;
        return;
      }
    }
  }

  mouseDragged() {
    if (this.dragging && this.currentRect !== null && this.dragPoint === null) {
      this.currentRect.x = mouseX - this.currentRect.w / 2;
      this.currentRect.y = mouseY - this.currentRect.h / 2;
    }
  }

  mouseReleased() {
    this.dragging = false;
    this.dragPoint = null;
    if (this.currentRect !== null) {
      // Check if the current rectangle is inside the big rectangle
      if (this.bigRect.isInside(this.currentRect.x + this.currentRect.w / 2, this.currentRect.y + this.currentRect.h / 2)) {
        // Check if the rectangle is placed correctly based on location
        let rectIndex = this.smallRects.indexOf(this.currentRect);
        const guidelineIndex = this.checkPlacement(this.currentRect);
        if (guidelineIndex !== -1) {
          if (!this.placedOrder.includes(rectIndex)) {
            this.placedOrder.push(rectIndex);
          }
        } else {
          const index = this.placedOrder.indexOf(rectIndex);
          if (index > -1) {
            this.placedOrder.splice(index, 1);
          }
        }
      } else {
        // Remove the rectangle from the placed order if it's moved out
        const index = this.placedOrder.indexOf(this.smallRects.indexOf(this.currentRect));
        if (index > -1) {
          this.placedOrder.splice(index, 1);
        }
      }
    }
    this.currentRect = null;
  }

  checkAllPlacements() {
    for (let i = 0; i < this.smallRects.length; i++) {
      let rect = this.smallRects[i];
      if (!this.checkPlacement(rect) || !this.checkSizeAccuracy(rect, i)) {
        return false;
      }
    }
    return true;
  }

  checkPlacement(rect) {
    for (let i = 0; i < this.guidelines.length; i++) {
      let guideline = this.guidelines[i];
      let centerX = rect.x + rect.w / 2;
      let centerY = rect.y + rect.h / 2;

      let withinX = abs(centerX - (guideline.x + guideline.w / 2)) <= guideline.w * 0.1;
      let withinY = abs(centerY - (guideline.y + guideline.h / 2)) <= guideline.h * 0.1;

      // Check if the rectangle's center is within 10% of the guideline's center
      // and if the color matches
      if (withinX && withinY && rect.col.levels[0] == guideline.col.levels[0] &&
          rect.col.levels[1] == guideline.col.levels[1] &&
          rect.col.levels[2] == guideline.col.levels[2]) {
        return true;
      }
    }
    return false;
  }

  checkSizeAccuracy(rect, index) {
    let guideline = this.guidelines[index];
    let widthAccuracy = abs(guideline.w - rect.w) / guideline.w;
    let heightAccuracy = abs(guideline.h - rect.h) / guideline.h;
    return widthAccuracy <= 0.2 && heightAccuracy <= 0.2;
  }
}

