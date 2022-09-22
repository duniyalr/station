import { Line } from "./Line";
import { Wagon, WagonOpts } from "./Wagon";

export enum TrainMode {
  DEFAULT,
}

export type TrainOpts = {
  mode?: TrainMode;
};
export type CreateWagonOpts = WagonOpts;
export enum TrainStatus {
  IDLE = "idle",
  WORKING = "working",
  COMPLETE = "complete",
}

export type TrainResponse = any;

export class Train {
  line: Line;
  mode: TrainMode = TrainMode.DEFAULT;
  status: TrainStatus = TrainStatus.IDLE;
  wagons: Wagon[] = [];

  constructor(line: Line, opts?: TrainOpts) {
    this.line = line;
    opts = Object.assign({}, opts);
  }

  static createWagon = (opts: CreateWagonOpts): Wagon => {
    const wagon = new Wagon(opts);

    return wagon;
  };

  addWagon = (wagon: Wagon) => {
    this.wagons.push(wagon);
  };

  removeFirstWagon = (): Wagon | undefined => {
    return this.wagons.shift();
  };

  run = async () => {
    const wagons = this.wagons;

    if (wagons.length === 0) return this.complete();
    if (wagons.length === 1) {
      this.status = TrainStatus.WORKING;
      const wagon = wagons[0];
      try {
        const wagonResponse = await wagon.run();
        this.removeFirstWagon();
        return this.complete(wagonResponse);
      } catch (err) {
        return this.error(err as Error);
      }
    }
  };

  complete = (trainResponse?: TrainResponse) => {
    this.status = TrainStatus.COMPLETE;
    return this.line.onTrainComplete(trainResponse);
  };

  error = (err: Error) => {};
}
