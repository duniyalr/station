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
