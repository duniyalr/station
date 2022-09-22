import { Station, Message } from "./lib";

const station = new Station();
const publicLine = station.getOrCreateLine("PUBLIC");
publicLine.addListener({
  listener: (msg: Message) => {
    console.log("From listener");
    console.log(msg);
  },
});
publicLine
  .after({
    fetcher: () => {
      return { msg: "this is my response" };
    },
    payload: {},
  })
  .after({
    fetcher: () => {
      return { msg: "this is second request" };
    },
  });
publicLine.addListener({
  listener: () => {
    console.log("From listener 1");
  },
});

console.log(publicLine);
