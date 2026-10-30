export interface Point {
  x: number;
  y: number;
}

export interface StrokeStyle {
  width: number;
  color: string;
  sticker: string;
}

export interface Stroke {
  points: Point[];
  style: StrokeStyle;
}

export interface Tool {
  name: string;
  content: string;
  style: StrokeStyle;
}

export const tools: Tool[] = [];

export const strokes: Stroke[] = [];

const redoStack: Stroke[] = [];

// Save a finished stroke
export function commitStroke(stroke: Stroke) {
  strokes.push(stroke);
  redoStack.length = 0;
}

export function canUndo(): boolean {
  return strokes.length > 0;
}

export function canRedo(): boolean {
  return redoStack.length > 0;
}

export function undo() {
  const stroke = strokes.pop();
  if (stroke) redoStack.push(stroke);
}

export function redo() {
  const stroke = redoStack.pop();
  if (stroke) strokes.push(stroke);
}

export function addTool(
  name: string,
  content: string,
  style: StrokeStyle,
) {
  tools.push({ name, content, style });
}
