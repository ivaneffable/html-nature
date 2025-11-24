import "./main.css";
import { playNatureTone } from "./audio";

const occupiedPositions = new Map<string, string>();
let numOfWalkers = 0;
const COLORS = ["#e94b3c", "#50c878", "#ff8c00", "#4a90e2", "#9b59b6"];

class Walker {
  x: number;
  y: number;
  audioEnabled: boolean = false;
  avoidOthers: boolean = false;
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
    const key = `${this.x},${this.y}`;
    occupiedPositions.set(key, this.color);
  }

  step() {
    const weights = [1, 1, 1, 1]; // [right, left, down, up]

    // Only check for obstacles if avoidOthers is enabled
    if (this.avoidOthers) {
      // Check for occupied positions in all 4 directions (50px range)

      // Check right direction (x + 4 to x + 50)
      let hasOccupiedRight = false;
      for (let checkX = this.x + 4; checkX <= this.x + 50; checkX += 1) {
        if (
          occupiedPositions.get(`${checkX},${this.y}`) !== undefined &&
          occupiedPositions.get(`${checkX},${this.y}`) !== this.color
        ) {
          hasOccupiedRight = true;
          break;
        }
      }

      // Check left direction (x - 4 to x - 50)
      let hasOccupiedLeft = false;
      for (let checkX = this.x - 4; checkX >= this.x - 50; checkX -= 1) {
        if (
          occupiedPositions.get(`${checkX},${this.y}`) !== undefined &&
          occupiedPositions.get(`${checkX},${this.y}`) !== this.color
        ) {
          hasOccupiedLeft = true;
          break;
        }
      }

      // Check down direction (y + 4 to y + 50)
      let hasOccupiedDown = false;
      for (let checkY = this.y + 4; checkY <= this.y + 50; checkY += 1) {
        if (
          occupiedPositions.get(`${this.x},${checkY}`) !== undefined &&
          occupiedPositions.get(`${this.x},${checkY}`) !== this.color
        ) {
          hasOccupiedDown = true;
          break;
        }
      }

      // Check up direction (y - 4 to y - 50)
      let hasOccupiedAbove = false;
      for (let checkY = this.y - 4; checkY >= this.y - 50; checkY -= 1) {
        if (
          occupiedPositions.get(`${this.x},${checkY}`) !== undefined &&
          occupiedPositions.get(`${this.x},${checkY}`) !== this.color
        ) {
          hasOccupiedAbove = true;
          break;
        }
      }

      // Reduce probability to 15% for directions with obstacles
      if (hasOccupiedRight) weights[0] = 0.15;
      if (hasOccupiedLeft) weights[1] = 0.15;
      if (hasOccupiedDown) weights[2] = 0.15;
      if (hasOccupiedAbove) weights[3] = 0.15;
    }

    // Calculate total weight and choose direction
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    let choice = 0;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        choice = i;
        break;
      }
    }

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

    const audioCheckbox = clone.querySelector(
      ".audio-checkbox"
    ) as HTMLInputElement;
    const audioLabel = clone.querySelector(".audio-label") as HTMLLabelElement;

    const avoidCheckbox = clone.querySelector(
      ".avoid-checkbox"
    ) as HTMLInputElement;
    const avoidLabel = clone.querySelector(".avoid-label") as HTMLLabelElement;

    // Set the color as a CSS custom property on the walker-config element
    if (walkerConfig) {
      walkerConfig.style.setProperty("--walker-color", color);
    }

    // Setup audio checkbox
    audioCheckbox.id = `walker-audio-${numOfWalkers}`;
    audioCheckbox.checked = false;
    audioLabel.htmlFor = `walker-audio-${numOfWalkers}`;

    audioCheckbox.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      walkerInstance.audioEnabled = target.checked;
    });

    // Setup avoid checkbox
    avoidCheckbox.id = `walker-avoid-${numOfWalkers}`;
    avoidCheckbox.checked = false; // Default to disabled
    avoidLabel.htmlFor = `walker-avoid-${numOfWalkers}`;

    avoidCheckbox.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      walkerInstance.avoidOthers = target.checked;
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
