import { Line, LineOpts } from "./Line";
import { Message, MessageType, Observer } from "./Observer";

export class Station {
  lines: Map<string, Line> = new Map();
  observer: Observer;
  errorObserver: Observer;

  constructor() {
    this.observer = new Observer();
    this.errorObserver = new Observer();
  }

  getLine = (lineName: string): Line | undefined => {
    return this.lines.get(lineName);
  };

  // create line also creates the listeners;
  createLine = (lineName: string, lineopts?: LineOpts): Line => {
    if (this.lines.get(lineName))
      throw new Error(`Line with ${lineName} name already exists`);
    let opts = Object.assign({}, lineopts);
    if (!opts.station) opts.station = this;
    const line = new Line(lineName, opts);
    this.lines.set(lineName, line);
    this.observer.createLineListener(lineName);
    this.errorObserver.createLineListener(lineName);
    return line;
  };

  getOrCreateLine = (lineName: string): Line => {
    let line = this.getLine(lineName);
    if (line) return line;
    return this.createLine(lineName);
  };

  emitMessage = (message: Message) => {
    if (message.type === MessageType.RESPONSE) {
      return this.observer.onMessage(message);
    }
    return this.errorObserver.onMessage(message);
  };
}
