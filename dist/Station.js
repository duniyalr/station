import { Line } from "./Line";
import { Observer } from "./Observer";
export class Station {
    constructor() {
        this.lines = new Map();
        this.getLine = (lineName) => {
            return this.lines.get(lineName);
        };
        // create line also creates the listeners;
        this.createLine = (lineName, lineopts) => {
            if (this.lines.get(lineName))
                throw new Error(`Line with ${lineName} name already exists`);
            let opts = Object.assign({}, lineopts);
            if (!opts.station)
                opts.station = this;
            const line = new Line(lineName, opts);
            this.lines.set(lineName, line);
            this.observer.createLineListener(lineName);
            return line;
        };
        this.getOrCreateLine = (lineName) => {
            let line = this.getLine(lineName);
            if (line)
                return line;
            return this.createLine(lineName);
        };
        this.emitMessage = (message) => {
            this.observer.onMessage(message);
        };
        this.observer = new Observer();
    }
}
