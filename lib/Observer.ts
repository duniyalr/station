import { WagonError, WagonResponse } from "./Wagon";

export const DEFAULT_SCOPE_NAME = "__default";
export type Response = any;
export type ListenerOpts = {
  listener: any;
  scope?: string;
};
export class LineObserver {
  scopes: string[];
  listeners: Map<string, Listener[]>;
  constructor() {
    this.scopes = [];
    this.listeners = new Map();
  }
}
export type Listener = (response: Response) => void;
export enum MessageType {
  RESPONSE = "response",
  ERROR = "error",
}
export class Message {
  name: string;
  type: MessageType;
  next: boolean = true;
  response: WagonResponse | WagonError;

  constructor(name: string, response: WagonResponse | WagonError) {
    this.name = name;
    this.response = response;
    if (this.response instanceof WagonResponse)
      this.type = MessageType.RESPONSE;
    else this.type = MessageType.ERROR;
  }

  stopPropagation = () => {
    console.log("stop propagation");
    this.next = false;
  };
}

export class ResponseError {
  error: any;
  rollback: any;

  constructor(error: any, rollback: any) {
    this.error = error;
    this.rollback = rollback;
  }
}

export class Observer {
  listeners: Map<string, LineObserver> = new Map();

  *getLineListeners(name: string) {
    const lineListeners = this.listeners.get(name);
    if (!lineListeners || !lineListeners.scopes) return undefined;
    for (const scope of lineListeners.scopes) {
      const listeners = lineListeners.listeners.get(scope) || [];
      for (const listener of listeners) yield listener;
    }
  }

  getLineListenersOrCreate = (
    name: string,
    scopeName: string = DEFAULT_SCOPE_NAME
  ): Listener[] | undefined => {
    const lineListeners = this.listeners.get(name);
    if (!lineListeners) throw new Error(`Line listener with ${name} not found`);
    let scopeListeners = lineListeners.listeners.get(scopeName);
    if (!scopeListeners) {
      scopeListeners = [];
      lineListeners.listeners.set(scopeName, scopeListeners);
      lineListeners.scopes.push(scopeName);
    }
    return scopeListeners;
  };

  createLineListener(name: string): void {
    if (this.listeners.get(name))
      throw new Error(`Line listener created before`);
    const lineListeners = new Map();
    lineListeners.set(DEFAULT_SCOPE_NAME, []);
    this.listeners.set(name, new LineObserver());
  }

  addListener = (name: string, listenerOpts: ListenerOpts) => {
    const listeners = this.getLineListenersOrCreate(name, listenerOpts.scope);
    if (!listeners) throw new Error(`The line listener with ${name} not found`);
    listeners.unshift(listenerOpts.listener);
  };

  removeListeners = (lineName: string) => {
    const listenersMap = this.listeners.get(lineName);
    if (!listenersMap) {
      // throw new Error(`Listeners for ${lineName} not found`);
      return;
    }
    this.listeners.delete(lineName);
    this.createLineListener(lineName);
  };

  removeScopeListeners = (lineName: string, scopeName: string) => {
    const listenersMap = this.listeners.get(lineName);
    if (!listenersMap) throw new Error(`Listeners for ${lineName} not found`);
    const scopeListeneres = listenersMap.listeners.get(scopeName);
    if (!scopeListeneres) {
      // throw new Error(`Scope with ${scopeName} not found`);
      return;
    }
    listenersMap.listeners.set(scopeName, []);
  };

  onMessage = (message: Message) => {
    console.log("message comes", message);
    for (const listener of this.getLineListeners(message.name)) {
      console.log(listener);
      if (!message.next) return;
      listener(message);
    }
  };
}
