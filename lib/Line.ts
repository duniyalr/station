import { ListenerOpts, Message } from "./Observer";
import { Station } from "./Station";
import { CreateWagonOpts, Train, TrainResponse, TrainStatus } from "./Train";

export enum LineMode {
  // in auto mode sending request will done automatically when inserted
  AUTO,
  // in manual mode user should explicitly runs the request
  MANUAL,
}

export type LineOpts = {
  station: Station;
  mode?: LineMode;
};

export enum LineStatus {
  EMPTY,
  PAUSE,
  WORKING,
}

export type AfterOpts = CreateWagonOpts;
export type WithOpts = CreateWagonOpts;

export class Line {
  station: Station;
  name: string;
  status: LineStatus = LineStatus.EMPTY;
  trains: Train[] = [];
  workingTrain: Train | undefined;
  constructor(name: string, opts: LineOpts) {
    this.name = name;
    opts = Object.assign({}, opts);
    this.station = opts.station;
    if (!opts.mode) opts.mode = LineMode.AUTO;
  }

  createTrain = (): Train => {
    const train = new Train(this);
    return train;
  };

  addTrain = (train: Train) => {
    this.trains.push(train);
  };

  getLastTrain = (): Train => {
    return this.trains[this.trains.length - 1];
  };

  after = (opts: AfterOpts): Line => {
    const train = this.createTrain();
    this.addTrain(train);

    const wagon = Train.createWagon(opts);
    train.addWagon(wagon);

    if (this.status === LineStatus.EMPTY) this.status = LineStatus.PAUSE;
    this.run();
    return this;
  };

  // if there is no train in stack no error will throws
  // instead a train will created;
  with = (opts: WithOpts): Line => {
    let lastTrain = this.getLastTrain();
    if (!lastTrain || lastTrain.status === TrainStatus.WORKING) {
      return this.after(opts);
    }

    const wagon = Train.createWagon(opts);
    lastTrain.addWagon(wagon);

    return this;
  };

  run = () => {
    if (this.trains.length === 0) return (this.status = LineStatus.EMPTY);

    if (this.status === LineStatus.WORKING) return;

    this.status = LineStatus.WORKING;
    this.workingTrain = this.trains[0];
    this.workingTrain.run();
  };

  addListener(listenerOpts: ListenerOpts) {
    this.station.observer.addListener(this.name, listenerOpts);
  }

  onTrainComplete = (trainResponse: TrainResponse) => {
    const observerMessage = new Message(
      this.name,
      trainResponse,
      trainResponse.payload
    );
    this.station.emitMessage(observerMessage);
  };

  onTrainError = (err: Error) => {};
}
