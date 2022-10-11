var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Wagon } from "./Wagon";
export var TrainMode;
(function (TrainMode) {
    TrainMode[TrainMode["DEFAULT"] = 0] = "DEFAULT";
})(TrainMode || (TrainMode = {}));
export var TrainStatus;
(function (TrainStatus) {
    TrainStatus["IDLE"] = "idle";
    TrainStatus["WORKING"] = "working";
    TrainStatus["COMPLETE"] = "complete";
})(TrainStatus || (TrainStatus = {}));
export class Train {
    constructor(line, opts) {
        this.mode = TrainMode.DEFAULT;
        this.status = TrainStatus.IDLE;
        this.wagons = [];
        this.addWagon = (wagon) => {
            this.wagons.push(wagon);
        };
        this.removeFirstWagon = () => {
            return this.wagons.shift();
        };
        this.run = () => __awaiter(this, void 0, void 0, function* () {
            const wagons = this.wagons;
            if (wagons.length === 0)
                return;
            if (wagons.length === 1) {
                this.status = TrainStatus.WORKING;
                const wagon = wagons[0];
                const wagonResult = yield wagon.run();
                this.removeFirstWagon();
                return this.result(wagonResult);
            }
        });
        this.result = (wagonResult) => {
            this.status = TrainStatus.COMPLETE;
            return this.line.onTrainResult(wagonResult);
        };
        this.line = line;
        opts = Object.assign({}, opts);
    }
}
Train.createWagon = (opts) => {
    const wagon = new Wagon(opts);
    return wagon;
};
