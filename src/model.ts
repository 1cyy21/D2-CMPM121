export interface Point {
  x: number;
  y: number;
}

export interface StrokeStyle {
  width: number;
  color: string;
}

export interface Stroke {
  points: Point[];
  style: StrokeStyle;
}

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