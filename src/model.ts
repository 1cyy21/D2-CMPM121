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
