export type WagonOpts = {
  fn: any;
  args?: any[];
};

export enum WagonStatus {
  IDLE,
  WORKING,
  COMPLETE,
}

export class Wagon {
  status: WagonStatus = WagonStatus.IDLE;
  fn: any;
  args: any[];

  constructor(opts: WagonOpts) {
    this.fn = opts.fn;
    if (opts.args) this.args = opts.args;
    else this.args = [];
  }

  run = (): Promise<any> | any => {
    return this.fn.apply(this.args);
  };
}
