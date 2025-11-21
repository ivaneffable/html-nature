import "./main.css";
import { playNatureTone } from "./audio";

class Walker {
  x: number;
  y: number;
  audioEnabled: boolean = false;

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

      // Only play audio if enabled
      if (this.audioEnabled) {
        // Map x to lower frequencies for deeper sounds
        const xFrequency = (this.x / window.innerWidth) * 300 + 100; // 100-400 Hz range
        // Map y to duration - higher positions = shorter chirps
        const yDuration =
          ((window.innerHeight - this.y) / window.innerHeight) * 0.4 + 0.05; // 0.05-0.45 seconds
        playNatureTone(xFrequency, yDuration);
      }
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

function createWalkerConfig() {
  const configContainer = document.querySelector(".config-container");
  const template = document.getElementById(
    "walker-config-template"
  ) as HTMLTemplateElement;

  if (configContainer && template) {
    const clone = template.content.cloneNode(true) as DocumentFragment;

    const checkbox = clone.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    const label = clone.querySelector("label") as HTMLLabelElement;

    checkbox.id = "walker-checkbox";
    checkbox.checked = false;
    label.htmlFor = "walker-checkbox";

    checkbox.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      walker.audioEnabled = target.checked;
    });

    // Append to container
    configContainer.appendChild(clone);
  }
}

const walkers: Walker[] = [];

// Create walker first
const walker = new Walker();
walker.draw();
walkers.push(walker);

createWalkerConfig();
