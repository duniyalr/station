var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var WagonStatus;
(function (WagonStatus) {
    WagonStatus["IDLE"] = "idle";
    WagonStatus["WORKING"] = "working";
    WagonStatus["COMPLETE"] = "working";
})(WagonStatus || (WagonStatus = {}));
export class WagonResponse {
    constructor(response, payload) {
        this.response = response;
        this.payload = payload;
    }
}
export class WagonError {
    constructor(error, rollback) {
        this.error = error;
        this.rollback = rollback;
    }
}
export class Wagon {
    constructor(opts) {
        this.status = WagonStatus.IDLE;
        this.run = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.fn(this.args);
                this.status = WagonStatus.COMPLETE;
                return new WagonResponse(response, this.payload);
            }
            catch (err) {
                return new WagonError(err, this.rollback);
            }
        });
        this.fetcher = opts.fetcher;
        this.fn = (args) => __awaiter(this, void 0, void 0, function* () {
            let response = this.fetcher.apply(args);
            if (response instanceof Promise) {
                response = yield response;
            }
            return response;
        });
        if (opts.payload)
            this.payload = opts.payload;
        // if rollback not provided payload will be used;
        if (opts.rollback)
            this.rollback = opts.rollback;
        else
            this.rollback = this.payload;
        if (opts.args)
            this.args = opts.args;
        else
            this.args = [];
    }
}
