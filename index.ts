import { Message, Station } from "./lib";

const station = new Station();
const publicLine = station.getOrCreateLine("PUBLIC");
publicLine.addListener({
  listener: (msg: Message) => {
    console.log("from inner", msg);
  },
  scope: "duniyal",
});

publicLine.addListener({
  listener: (msg: Message) => {
    console.log("from public listener");
  },
});

publicLine.addErrorListener({
  listener: (msg: Message) => {
    console.log(msg);
  },
});

publicLine.after({
  fetcher: () => {
    throw new Error("this is error");
    return { message: "this is response" };
  },
  payload: { id: 12345 },
  rollback: "gonna",
});
