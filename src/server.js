"use strict";
const WebSocket = require("ws");

const { handleConnection, getBroadcaster } = require("./helpers");
const methods = require("./methods");
const jobs = require("./jobs");
const config = require("./config");

const main = () => {
	const wss = new WebSocket.Server({ port: config.server.port, host: config.server.host });
	const broadcast = getBroadcaster(wss);

	const interval = setInterval(() => {
		for (const job in jobs) {
			const result = jobs[job]();
			broadcast(job, result);
		}
	}, config.job.interval);

	const processConnection = (connection) => {
		handleConnection(connection, broadcast, methods);
	};

	wss.on("connection", processConnection);
	wss.on("listening", () => {
		console.log(`WebSocket listening on ${config.server.host}:${config.server.port}.`);
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
