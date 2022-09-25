export type WagonOpts = {
  fetcher: any;
  payload?: any;
  rollback?: any;
  args?: any[];
  onComplete?: any;
  onError?: any;
};

export enum WagonStatus {
  IDLE = "idle",
  WORKING = "working",
  COMPLETE = "working",
}

export class WagonResponse {
  response: any;
  payload: any;
  constructor(response: any, payload: any) {
    this.response = response;
    this.payload = payload;
  }
}

export class WagonError {
  error: any;
  rollback: any;

  constructor(error: any, rollback: any) {
    this.error = error;
    this.rollback = rollback;
  }
}

export class Wagon {
  status: WagonStatus = WagonStatus.IDLE;
  fetcher: any;
  fn: any;
  payload: any;
  rollback: any;
  args: any[];

  constructor(opts: WagonOpts) {
    this.fetcher = opts.fetcher;
    this.fn = async (args: any[]) => {
      let response = this.fetcher.apply(args);
      if (response instanceof Promise) {
        response = await response;
      }

      return response;
    };
    if (opts.payload) this.payload = opts.payload;
    // if rollback not provided payload will be used;
    if (opts.rollback) this.rollback = opts.rollback;
    else this.rollback = this.payload;
    if (opts.args) this.args = opts.args;
    else this.args = [];
  }

  run = async (): Promise<WagonResponse | WagonError> => {
    try {
      const response = await this.fn(this.args);
      this.status = WagonStatus.COMPLETE;
      return new WagonResponse(response, this.payload);
    } catch (err) {
      return new WagonError(err, this.rollback);
    }
  };
}
