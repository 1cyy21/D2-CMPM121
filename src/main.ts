import "./style.css";
// Stroke data
import {
  appendDropdown,
  canRedo,
  canUndo,
  commitStroke,
  options,
  redo,
  strokes,
  undo,
} from "./model.ts";
import type { Point, Stroke, StrokeStyle } from "./model.ts";
// Rendering
import { renderScene } from "./render.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const redrawBtn = document.querySelector<HTMLButtonElement>("#redraw")!;
const undoBtn = document.querySelector<HTMLButtonElement>("#undo")!;
const redoBtn = document.querySelector<HTMLButtonElement>("#redo")!;
const nameInput = document.querySelector<HTMLInputElement>("#nameInput")!;
const stickerInput = document.querySelector<HTMLInputElement>("#stickerInput")!;
const addSticker = document.querySelector<HTMLSelectElement>("#addSticker")!;
const brushSelect = document.querySelector<HTMLSelectElement>("#brushSelect")!;
const ctx = canvas.getContext("2d")!;
let currentStyle: StrokeStyle = { width: 4, color: "#222", sticker: "" };

let currentStroke: Stroke | null = null;

// Starter Dropdown Options

const dropdown = document.getElementById("brushSelect");

appendDropdown("Thin Brush", "ThinBrush");
appendDropdown("Thick Brush", "ThickBrush");
appendDropdown("Smiley Face", "☺️");
appendDropdown("Pumpkin", "🎃");
appendDropdown("Top Hat", "🎩");

options.forEach((element) => {
  const add = document.createElement("option");
  add.textContent = element.name;
  add.value = element.content;
  dropdown?.appendChild(add);
});

// Draw Scene
function render() {
  renderScene(ctx, strokes, currentStroke);
  undoBtn.disabled = !canUndo();
  redoBtn.disabled = !canRedo();
}

// Turn mouse position into canvas position
function toCanvasPoint(event: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left - canvas.clientLeft) * canvas.width) /
      canvas.clientWidth,
    y: ((event.clientY - rect.top - canvas.clientTop) * canvas.height) /
      canvas.clientHeight,
  };
}

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  canvas.setPointerCapture(event.pointerId);
  currentStroke = {
    points: [toCanvasPoint(event)],
    style: { ...currentStyle },
  };
  render();
});

canvas.addEventListener("pointermove", (event) => {
  if (!currentStroke) return;
  currentStroke.points.push(toCanvasPoint(event));
  render();
});

canvas.addEventListener("pointerup", () => {
  if (!currentStroke) return;
  commitStroke(currentStroke);
  currentStroke = null;
  render();
});
canvas.addEventListener("pointercancel", () => {
  currentStroke = null;
  render();
});

// Undo/Redo Buttons

undoBtn.addEventListener("click", () => {
  undo();
  render();
});

redoBtn.addEventListener("click", () => {
  redo();
  render();
});

// Add new sticker

let stickerName = "";

nameInput.addEventListener("input", () => {
  stickerName = nameInput.value;
});

let stickerIcon = "";

stickerInput.addEventListener("input", () => {
  stickerIcon = stickerInput.value;
});

addSticker.addEventListener("click", () => {
  if ((stickerIcon != "") && (stickerName != "")) {
    const add = document.createElement("option");
    add.textContent = stickerName;
    add.value = stickerIcon;
    dropdown?.appendChild(add);
    appendDropdown(stickerName, stickerIcon);
  }
});

brushSelect.addEventListener("change", () => {
  const choice = options.find((options) =>
    options.content === brushSelect.value
  )?.content ?? "";
  console.log(choice);
  if (brushSelect.value == "ThinBrush") {
    currentStyle = { width: 4, color: "#222", sticker: "" };
  } else if (brushSelect.value == "ThickBrush") {
    currentStyle = { width: 8, color: "#222", sticker: "" };
  } else {
    currentStyle = { width: 1, color: "", sticker: choice };
  }
});

// Developer Check: wipe canvas and redraw
redrawBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
});
