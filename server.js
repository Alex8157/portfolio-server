"use strict";
const WebSocket = require("ws");

const { handleConnection, getBroadcaster } = require("./helpers");
const methods = require("./methods");
const jobs = require("./jobs");

const PORT = 8000;
const HOST = "0.0.0.0";
const INTERVAL = 1000;

const main = () => {
  const wss = new WebSocket.Server({ port: PORT, host: HOST });
  const broadcast = getBroadcaster(wss);

  const interval = setInterval(() => {
    for (const job in jobs) {
      const result = jobs[job]();
      broadcast(job, result);
    }
  }, INTERVAL);

  const processConnection = (connection) => {
    handleConnection(connection, broadcast, methods);
  };

  wss.on("connection", processConnection);
  wss.on("listening", () => {
    console.log(`WebSocket listening on ${HOST}:${PORT}.`);
  });
  wss.on("error", (error) => {
    console.log(`Closing server due to WebSocket server error: ${error.stack}`);
    wss.close();
  });
  wss.on("close", () => {
    console.log(`WebSocket server closed.`);
    clearInterval(interval);
    process.exit(0);
  });
};

main();
