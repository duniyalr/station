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
export class Message {
  name: string;
  response: Response;
  payload: any;

  constructor(name: string, response: Response, payload: any) {
    this.name = name;
    this.response = response;
    this.payload = payload;
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
    if (!listenersMap) throw new Error(`Listeners for ${lineName} not found`);
    this.listeners.delete(lineName);
    this.createLineListener(lineName);
  };

  removeScopeListeners = (lineName: string, scopeName: string) => {
    const listenersMap = this.listeners.get(lineName);
    if (!listenersMap) throw new Error(`Listeners for ${lineName} not found`);
    const scopeListeneres = listenersMap.listeners.get(scopeName);
    if (!scopeListeneres) throw new Error(`Scope with ${scopeName} not found`);
    listenersMap.listeners.set(scopeName, []);
  };

  onMessage = (message: Message) => {
    for (const listener of this.getLineListeners(message.name)) {
      listener(message.response);
    }
  };
}
