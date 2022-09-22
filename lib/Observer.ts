export type Response = any;
export type ListenerOpts = {
  listener: any;
};
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
  listeners: Map<string, Listener[]> = new Map();

  getLineListeners = (name: string): Listener[] | undefined => {
    return this.listeners.get(name);
  };

  createLineListener(name: string): void {
    if (this.getLineListeners(name))
      throw new Error(`Line listener created before`);
    this.listeners.set(name, []);
  }

  addListener = (name: string, listenerOpts: ListenerOpts) => {
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
