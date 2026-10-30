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
const clearPixels = document.querySelector<HTMLButtonElement>("#clearPixels")!;
const nameInput = document.querySelector<HTMLInputElement>("#nameInput")!;
const stickerInput = document.querySelector<HTMLInputElement>("#stickerInput")!;
const addSticker = document.querySelector<HTMLButtonElement>("#addSticker")!;
const brushSelect = document.querySelector<HTMLSelectElement>("#brushSelect")!;
const exportBtn = document.querySelector<HTMLButtonElement>("#export")!;
const ctx = canvas.getContext("2d")!;
let currentStyle: StrokeStyle = { width: 4, color: "#222", sticker: "" };

let currentStroke: Stroke | null = null;

// To add tools, then show in dropdown
function registerTool(name: string, content: string, style: StrokeStyle) {
  addTool(name, content, style);
  const option = document.createElement("option");
  option.textContent = name;
  option.value = content;
  brushSelect.appendChild(option);
}

registerTool("Thin Brush", "ThinBrush", {
  width: 4,
  color: "#222",
  sticker: "",
});
registerTool("Thick Brush", "ThickBrush", {
  width: 8,
  color: "#222",
  sticker: "",
});
registerTool("Smiley Face", "☺️", { width: 1, color: "", sticker: "☺️" });
registerTool("Pumpkin", "🎃", { width: 1, color: "", sticker: "🎃" });
registerTool("Top Hat", "🎩", { width: 1, color: "", sticker: "🎩" });

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

// Clear pixels on screen
clearPixels.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

addSticker.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const icon = stickerInput.value.trim();
  if (name === "" || icon === "") return;
  registerTool(name, icon, { width: 1, color: "", sticker: icon });
  nameInput.value = "";
  stickerInput.value = "";
});

// Selecting a tool copies its style from tool's data
brushSelect.addEventListener("change", () => {
  const tool = tools.find((tool) => tool.content === brushSelect.value);
  if (tool) currentStyle = { ...tool.style };
});

// Export PNG
const EXPORT_SCALE = 2;

exportBtn.addEventListener("click", () => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width * EXPORT_SCALE;
  exportCanvas.height = canvas.height * EXPORT_SCALE;
  const exportCtx = exportCanvas.getContext("2d")!;

  exportCtx.scale(EXPORT_SCALE, EXPORT_SCALE);

  renderScene(exportCtx, strokes, null, "white");

  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sketch.png";
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

// Developer Check: wipe canvas and redraw
redrawBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
});

render();
