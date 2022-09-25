import { Line } from "./Line";
import { Wagon, WagonError, WagonOpts, WagonResponse } from "./Wagon";

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

    if (wagons.length === 0) return;
    if (wagons.length === 1) {
      this.status = TrainStatus.WORKING;
      const wagon = wagons[0];
      const wagonResult = await wagon.run();

      this.removeFirstWagon();
      return this.result(wagonResult);
    }
  };

  result = (wagonResult: WagonResponse | WagonError) => {
    this.status = TrainStatus.COMPLETE;
    return this.line.onTrainResult(wagonResult);
  };
}
