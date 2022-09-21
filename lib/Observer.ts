export type Response = any;
export type Listener = (response: Response) => void;
export type Message = {
  name: string;
  response: Response;
};

export class Observer {
  listeners: Map<string, Listener[]> = new Map();

  getLineListeners = (name: string): Listener[] | undefined => {
    return this.listeners.get(name);
  };

  onMessage = (message: Message) => {
    const messageListeners = this.getLineListeners(message.name);
    if (!messageListeners)
      throw new Error(`Listeners not setted for ${message.name} line`);
    messageListeners.forEach((listener) => listener(message.response));
  };
}
