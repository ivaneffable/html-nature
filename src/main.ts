import "./main.css";
import { playNatureTone } from "./audio";

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

      // Create jungle-like sounds based on position
      // Map x to lower frequencies for deeper, more ambient jungle sounds
      const xFrequency = (this.x / window.innerWidth) * 300 + 100; // 100-400 Hz range
      // Map y to duration - higher positions = shorter chirps (like birds)
      const yDuration =
        ((window.innerHeight - this.y) / window.innerHeight) * 0.4 + 0.05; // 0.05-0.45 seconds
      playNatureTone(xFrequency, yDuration);
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
