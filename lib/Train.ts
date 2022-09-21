import { Line } from "./Line";
import { Wagon, WagonOpts } from "./Wagon";

export enum TrainMode {}

export type TrainOpts = {
  mode?: TrainMode;
};
export type CreateWagonOpts = WagonOpts;
export enum TrainStatus {
  IDLE,
  WORKING,
  COMPLETE,
}

export type TrainResponse = any;

export class Train {
  line: Line;
  mode: TrainMode;
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

  run = async () => {
    const wagons = this.wagons;

    if (wagons.length === 0) return this.complete();
    if (wagons.length === 1) {
      this.status = TrainStatus.WORKING;
      const wagon = wagons[0];
      try {
        let wagonResponse = wagon.run();
        if (wagonResponse instanceof Promise) {
          wagonResponse = await wagonResponse;
        }
        return this.complete(wagonResponse);
      } catch (err) {
        return this.error(err);
      }
    }
  };

  complete = (trainResponse?: TrainResponse) => {
    this.status = TrainStatus.COMPLETE;
    return this.line.onTrainComplete(trainResponse);
  };

  error = (err: Error) => {};
}
