import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

// Turn mouse position into canvas position
function toCanvasPoint(e: PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left - canvas.clientLeft) * canvas.width) /
      canvas.clientWidth,
    y: ((e.clientY - rect.top - canvas.clientTop) * canvas.height) /
      canvas.clientHeight,
  };
}

// Pointer last location
let last: { x: number; y: number } | null = null;

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  canvas.setPointerCapture(event.pointerId);
  last = toCanvasPoint(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (!last) return;
  const point = toCanvasPoint(event);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#222";
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  last = point;
});

function stopDrawing() {
  last = null;
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
