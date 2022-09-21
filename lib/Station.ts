import { Line } from "./Line";

export class Station {
  lines: Map<string, Line> = new Map();

  getLine = (lineName: string): Line | undefined => {
    return this.lines.get(lineName);
  };

  createLine = (lineName: string): Line => {
    if (this.lines.get(lineName))
      throw new Error(`Line with ${lineName} name already exists`);
    const line = new Line(lineName);
    this.lines.set(lineName, line);
    return line;
  };

  getOrCreateLine = (lineName: string): Line => {
    let line = this.getLine(lineName);
    if (line) return line;
    return this.createLine(lineName);
  };
}
