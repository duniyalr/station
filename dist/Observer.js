import { WagonResponse } from "./Wagon";
export const DEFAULT_SCOPE_NAME = "__default";
export class LineObserver {
    constructor() {
        this.scopes = [];
        this.listeners = new Map();
    }
}
export var MessageType;
(function (MessageType) {
    MessageType["RESPONSE"] = "response";
    MessageType["ERROR"] = "error";
})(MessageType || (MessageType = {}));
export class Message {
    constructor(name, response) {
        this.next = true;
        this.stopPropagation = () => {
            console.log("stop propagation");
            this.next = false;
        };
        this.name = name;
        this.response = response;
        if (this.response instanceof WagonResponse)
            this.type = MessageType.RESPONSE;
        else
            this.type = MessageType.ERROR;
    }
}
export class ResponseError {
    constructor(error, rollback) {
        this.error = error;
        this.rollback = rollback;
    }
}
export class Observer {
    constructor() {
        this.listeners = new Map();
        this.getLineListenersOrCreate = (name, scopeName = DEFAULT_SCOPE_NAME) => {
            const lineListeners = this.listeners.get(name);
            if (!lineListeners)
                throw new Error(`Line listener with ${name} not found`);
            let scopeListeners = lineListeners.listeners.get(scopeName);
            if (!scopeListeners) {
                scopeListeners = [];
                lineListeners.listeners.set(scopeName, scopeListeners);
                lineListeners.scopes.push(scopeName);
            }
            return scopeListeners;
        };
        this.addListener = (name, listenerOpts) => {
            const listeners = this.getLineListenersOrCreate(name, listenerOpts.scope);
            if (!listeners)
                throw new Error(`The line listener with ${name} not found`);
            listeners.unshift(listenerOpts.listener);
        };
        this.removeListeners = (lineName) => {
            const listenersMap = this.listeners.get(lineName);
            if (!listenersMap) {
                // throw new Error(`Listeners for ${lineName} not found`);
                return;
            }
            this.listeners.delete(lineName);
            this.createLineListener(lineName);
        };
        this.removeScopeListeners = (lineName, scopeName) => {
            const listenersMap = this.listeners.get(lineName);
            if (!listenersMap)
                throw new Error(`Listeners for ${lineName} not found`);
            const scopeListeneres = listenersMap.listeners.get(scopeName);
            if (!scopeListeneres) {
                // throw new Error(`Scope with ${scopeName} not found`);
                return;
            }
            listenersMap.listeners.set(scopeName, []);
        };
        this.onMessage = (message) => {
            console.log("message comes", message);
            for (const listener of this.getLineListeners(message.name)) {
                console.log(listener);
                if (!message.next)
                    return;
                listener(message);
            }
        };
    }
    *getLineListeners(name) {
        const lineListeners = this.listeners.get(name);
        if (!lineListeners || !lineListeners.scopes)
            return undefined;
        for (const scope of lineListeners.scopes) {
            const listeners = lineListeners.listeners.get(scope) || [];
            for (const listener of listeners)
                yield listener;
        }
    }
    createLineListener(name) {
        if (this.listeners.get(name))
            throw new Error(`Line listener created before`);
        const lineListeners = new Map();
        lineListeners.set(DEFAULT_SCOPE_NAME, []);
        this.listeners.set(name, new LineObserver());
    }
}
