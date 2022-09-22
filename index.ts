import { Station, Message } from "./lib";

const station = new Station();
const publicLine = station.getOrCreateLine("PUBLIC");
publicLine.addListener({
  listener: (msg: Message) => {
    console.log("From listener");
    console.log(msg);
  },
});
publicLine.removeListeneres();
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
    payload: { id: Symbol("fd") },
  });

setInterval(() => {
  publicLine.after({
    fetcher: () => {
      return { time: new Date() };
    },
  });
}, 2000);

setTimeout(() => {
  publicLine.addListener({
    listener: (msg: Message) => {
      console.log("inner", msg);
    },
    scope: "inner",
  });
}, 5000);

setTimeout(() => {
  publicLine.addListener({
    listener: (msg: Message) => {
      console.log(msg);
    },
  });
}, 1000);

const privateLine = station.getOrCreateLine("PRIVATE");
privateLine
  .after({
    fetcher: () => {
      return { msg: "For private" };
    },
  })
  .addListener({
    listener: (msg: Message) => {
      console.log("dddd", msg);
    },
  });

console.log(publicLine);
