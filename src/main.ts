import "./style.css";
// Stroke data
import {
  addTool,
  canRedo,
  canUndo,
  commitStroke,
  redo,
  strokes,
  tools,
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

// Starter Dropdown Tools

const dropdown = document.getElementById("brushSelect");

addTool("Thin Brush", "ThinBrush", { width: 4, color: "#222", sticker: "" });
addTool("Thick Brush", "ThickBrush", { width: 8, color: "#222", sticker: "" });
addTool("Smiley Face", "☺️", { width: 1, color: "", sticker: "☺️" });
addTool("Pumpkin", "🎃", { width: 1, color: "", sticker: "🎃" });
addTool("Top Hat", "🎩", { width: 1, color: "", sticker: "🎩" });

tools.forEach((tool) => {
  const add = document.createElement("option");
  add.textContent = tool.name;
  add.value = tool.content;
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
    addTool(stickerName, stickerIcon, {
      width: 1,
      color: "",
      sticker: stickerIcon,
    });
  }
});

// Repeated Switches: Moved each tool's style into its definition, removing the "if" chain
brushSelect.addEventListener("change", () => {
  const tool = tools.find((tool) => tool.content === brushSelect.value);
  if (tool) currentStyle = { ...tool.style };
});

// Developer Check: wipe canvas and redraw
redrawBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
});
