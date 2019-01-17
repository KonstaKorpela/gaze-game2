class Target {
  constructor() {
    this.x = this.getRandomArbitrary(200, 1080);
    this.y = this.getRandomArbitrary(200, 520);
    this.r = this.getRandomArbitrary(180, 200);
    this.d = this.getRandomArbitrary(100, 400);
    this.angle = 2 * Math.PI * Math.random();
    this.v = 6;
    this.dx = this.v * Math.cos(this.angle);
    this.dy = this.v * Math.sin(this.angle);
    this.distance = this.getRandomArbitrary(300, 600);
    this.lineX = this.distance * Math.cos(this.angle) + this.x;
    this.lineY = this.distance * Math.sin(this.angle) + this.y;
    this.color = this.getRandomColor();
    this.gameOver = false;
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomColor() {
    return `rgb(${this.getRandomArbitrary(100, 255)}, ${this.getRandomArbitrary(100, 255)}, ${this.getRandomArbitrary(100, 255)})`;
  }

  drawTarget(ctx, canvas) {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'darkblue';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r + 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'lightgreen';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = 'darkblue';
    ctx.fill();
    ctx.closePath();
  }

  updateTarget(ctx, canvas, lastVelocity, canvasX, canvasY) {

    if (!this.isInTarget(canvasX, canvasY, this.x, this.y, this.y) && !this.gameOver) {
      this.gameOver = true;
    }

    this.drawTarget(ctx, canvas);

    if (this.x + this.dx > canvas.width - this.r || this.x + this.dx < this.r) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy > canvas.height - this.r || this.y + this.dy < this.r) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  changeDirection(lastVelocity) {
    this.angle = 2 * Math.PI * Math.random();
    this.distance = this.getRandomArbitrary(300, 600);
    this.lineX = this.distance * Math.cos(this.angle) + this.x;
    this.lineY = this.distance * Math.sin(this.angle) + this.y;
    this.v = lastVelocity;
    this.dx = this.v * Math.cos(this.angle);
    this.dy = this.v * Math.sin(this.angle);
  }

  resetTarget() {
    this.x = this.getRandomArbitrary(200, 1080);
    this.y = this.getRandomArbitrary(200, 520);
    this.r = this.getRandomArbitrary(180, 200);
    this.v = 6;
    this.angle = 2 * Math.PI * Math.random();
    this.dx = this.v * Math.cos(this.angle);
    this.dy = this.v * Math.sin(this.angle);
    this.distance = this.getRandomArbitrary(300, 600);
    this.lineX = this.distance * Math.cos(this.angle) + this.x;
    this.lineY = this.distance * Math.sin(this.angle) + this.y;
    this.color = this.getRandomColor();
    this.gameOver = false;
  }

  isInTarget(x, y, cx, cy, r) {
    let dx = x - cx,
      dy = y - cy,
      dist = Math.sqrt(dx * dx + dy * dy);
    return dist < r;
  }
}

export {
  Target
};
