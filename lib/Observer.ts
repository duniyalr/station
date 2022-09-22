export const DEFAULT_SCOPE_NAME = "__default";
export type Response = any;
export type ListenerOpts = {
  listener: any;
};
export type LineObserver = Map<string, Listener[]>;
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

  getLineListeners = (
    name: string,
    scopeName: string = DEFAULT_SCOPE_NAME
  ): Listener[] | undefined => {
    return this.listeners.get(name)?.get(scopeName);
  };

  createLineListener(name: string): void {
    if (this.getLineListeners(name))
      throw new Error(`Line listener created before`);
    const lineListeners = new Map();
    lineListeners.set(DEFAULT_SCOPE_NAME, []);
    this.listeners.set(name, lineListeners);
  }

  addListener = (name: string, listenerOpts: ListenerOpts) => {
    console.log(this.listeners);
    const listeners = this.getLineListeners(name);
    if (!listeners) throw new Error(`The line listener with ${name} not found`);
    listeners.unshift(listenerOpts.listener);
  };

  onMessage = (message: Message) => {
    const messageListeners = this.getLineListeners(message.name);
    if (!messageListeners)
      throw new Error(`Listeners not setted for ${message.name} line`);
    messageListeners.forEach((listener) => listener(message.response));
  };
}
