import { Message, Station } from "./lib";

const station = new Station();
const publicLine = station.getOrCreateLine("PUBLIC");
publicLine.addListener({
  listener: (msg: Message) => {
    console.log("dani");
    // console.log("from inner", msg);
  },
});

publicLine.addListener({
  listener: (msg: Message) => {
    console.log("from public listener");
    console.log(msg.next);
  },
});

// publicLine.addErrorListener({
//   listener: (msg: Message) => {
//     console.log(msg);
//   },
// });

publicLine.after({
  fetcher: () => {
    return { message: "this is response" };
  },
  payload: { id: 12345 },
  rollback: "gonna",
});
