import "./main.css";

class Walker {
  x: number;
  y: number;

  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
  }

  show() {
    const app = document.getElementById("app");
    if (app) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.style.left = `${this.x - 2}px`;
      pixel.style.top = `${this.y - 2}px`;
      app.appendChild(pixel);
    }
  }

  step() {
    const choice = Math.floor(Math.random() * 4);
    switch (choice) {
      case 0:
        this.x += 4;
        break;
      case 1:
        this.x -= 4;
        break;
      case 2:
        this.y += 4;
        break;
      case 3:
        this.y -= 4;
        break;
    }
  }

  draw() {
    this.step();
    this.show();
    requestAnimationFrame(() => this.draw());
  }
}

const walker = new Walker();
walker.draw();
