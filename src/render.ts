import type { Stroke } from "./model.ts";

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const { points, style } = stroke;
  if (points.length === 0) return;

  ctx.save();
  if ((style.sticker != "") && (style.color == "")) {
    ctx.font = "32px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(style.sticker, points[0].x, points[0].y);
  } else {
    ctx.lineWidth = style.width;
    ctx.strokeStyle = style.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  currentStroke: Stroke | null,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const stroke of strokes) {
    drawStroke(ctx, stroke);
  }

  if (currentStroke) drawStroke(ctx, currentStroke);
}
