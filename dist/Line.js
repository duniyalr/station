import { Message } from "./Observer";
import { Train, TrainStatus } from "./Train";
export var LineMode;
(function (LineMode) {
    // in auto mode sending request will done automatically when inserted
    LineMode["AUTO"] = "auto";
    // in manual mode user should explicitly runs the request
    LineMode["MANUAL"] = "manual";
})(LineMode || (LineMode = {}));
export var LineStatus;
(function (LineStatus) {
    LineStatus["EMPTY"] = "empty";
    LineStatus["PAUSE"] = "pause";
    LineStatus["WORKING"] = "working";
})(LineStatus || (LineStatus = {}));
export class Line {
    constructor(name, opts) {
        this.status = LineStatus.EMPTY;
        this.trains = [];
        this.createTrain = () => {
            const train = new Train(this);
            return train;
        };
        this.addTrain = (train) => {
            this.trains.push(train);
        };
        this.getLastTrain = () => {
            return this.trains[this.trains.length - 1];
        };
        this.setWorkingTrain = (train) => {
            this.workingTrain = train;
        };
        this.setNextWorkingTrain = () => {
            this.setWorkingTrain(this.trains[this.trains.length - 1]);
        };
        this.after = (opts) => {
            const train = this.createTrain();
            this.addTrain(train);
            const wagon = Train.createWagon(opts);
            train.addWagon(wagon);
            if (this.status === LineStatus.EMPTY)
                this.status = LineStatus.PAUSE;
            this.run();
            return this;
        };
        // if there is no train in stack no error will throws
        // instead a train will created;
        this.with = (opts) => {
            let lastTrain = this.getLastTrain();
            if (!lastTrain || lastTrain.status === TrainStatus.WORKING) {
                return this.after(opts);
            }
            const wagon = Train.createWagon(opts);
            lastTrain.addWagon(wagon);
            return this;
        };
        this.run = () => {
            if (this.trains.length === 0)
                return (this.status = LineStatus.EMPTY);
            if (this.status === LineStatus.WORKING)
                return;
            this.status = LineStatus.WORKING;
            this.workingTrain = this.trains[0];
            this.workingTrain.run();
        };
        this.addListener = (listenerOpts) => {
            this.station.observer.addListener(this.name, listenerOpts);
        };
        this.addErrorListener = (listenerOpts) => {
            this.station.errorObserver.addListener(this.name, listenerOpts);
        };
        this.removeListeners = (scopeName) => {
            if (scopeName)
                return (this.station.observer.removeScopeListeners(this.name, scopeName),
                    this.station.errorObserver.removeScopeListeners(this.name, scopeName));
            return (this.station.observer.removeListeners(this.name),
                this.station.errorObserver.removeListeners(this.name));
        };
        this.checkWorkingTrain = () => {
            var _a;
            if (!this.workingTrain)
                return (this.status = LineStatus.EMPTY);
            if (((_a = this.workingTrain) === null || _a === void 0 ? void 0 : _a.status) === TrainStatus.IDLE)
                return (this.status = LineStatus.PAUSE);
            return (this.status = LineStatus.WORKING);
        };
        this.onTrainResult = (wagonResult) => {
            var _a;
            const observerMessage = new Message(this.name, wagonResult);
            this.station.emitMessage(observerMessage);
            this.trains.shift();
            this.setNextWorkingTrain();
            (_a = this.workingTrain) === null || _a === void 0 ? void 0 : _a.run();
            this.checkWorkingTrain();
        };
        this.name = name;
        opts = Object.assign({}, opts);
        this.station = opts.station;
        if (!opts.mode)
            opts.mode = LineMode.AUTO;
    }
}
