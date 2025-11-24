import "./main.css";
import { playNatureTone } from "./audio";

let numOfWalkers = 0;
const COLORS = ["#e94b3c", "#50c878", "#ff8c00", "#4a90e2", "#9b59b6"];

class Walker {
  x: number;
  y: number;
  audioEnabled: boolean = false;
  color: string;

  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.color = COLORS[numOfWalkers % COLORS.length];
  }

  show() {
    const app = document.getElementById("app");
    if (app) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.style.left = `${this.x - 2}px`;
      pixel.style.top = `${this.y - 2}px`;
      pixel.style.backgroundColor = this.color;
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

function createWalkerConfig(color: string, walkerInstance: Walker) {
  const configContainer = document.querySelector(".config-container");
  const template = document.getElementById(
    "walker-config-template"
  ) as HTMLTemplateElement;

  if (configContainer && template) {
    const clone = template.content.cloneNode(true) as DocumentFragment;

    const walkerConfig = clone.querySelector(
      ".walker-config"
    ) as HTMLDivElement;
    const checkbox = clone.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    const label = clone.querySelector("label") as HTMLLabelElement;

    // Set the color as a CSS custom property on the walker-config element
    if (walkerConfig) {
      walkerConfig.style.setProperty("--walker-color", color);
    }

    checkbox.id = `walker-checkbox-${numOfWalkers}`;
    checkbox.checked = false;
    label.htmlFor = `walker-checkbox-${numOfWalkers}`;

    checkbox.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      walkerInstance.audioEnabled = target.checked;
    });

    // Append to container
    configContainer.appendChild(clone);
  }
}

const walkers: Walker[] = [];

function addWalker() {
  const walker = new Walker();
  walker.draw();
  walkers.push(walker);
  createWalkerConfig(walker.color, walker);
  numOfWalkers++;

  if (numOfWalkers >= 5) {
    const addWalkerBtn = document.getElementById(
      "add-walker-btn"
    ) as HTMLButtonElement;
    if (addWalkerBtn) {
      addWalkerBtn.disabled = true;
    }
  }
}

// Create first walker
addWalker();

// Add event listener to the "Add Walker" button
const addWalkerBtn = document.getElementById("add-walker-btn");
if (addWalkerBtn) {
  addWalkerBtn.addEventListener("click", () => {
    addWalker();
  });
}
