import "./style.css";
// Stroke data
import { strokes } from "./model.ts";
import type { Point, Stroke, StrokeStyle } from "./model.ts";
// Rendering
import { renderScene } from "./render.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const redrawBtn = document.querySelector<HTMLButtonElement>("#redraw")!;
const ctx = canvas.getContext("2d")!;
const currentStyle: StrokeStyle = { width: 4, color: "#222" };

let currentStroke: Stroke | null = null;

// Draw Scene
function render() {
  renderScene(ctx, strokes, currentStroke);
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
  strokes.push(currentStroke);
  currentStroke = null;
  render();
});
canvas.addEventListener("pointercancel", () => {
  currentStroke = null;
  render();
});

// Developer Check: wipe canvas and redraw
redrawBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
});
