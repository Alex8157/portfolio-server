const WebSocket = require("ws");

const createMessage = (result, id = null) => {
  return JSON.stringify({ jsonrpc: "2.0", result, id });
};

const createErrorMessage = (error, id = null) => {
  return JSON.stringify({ jsonrpc: "2.0", error, id });
};

const createEventMessage = (method, params) => {
  return JSON.stringify({ jsonrpc: "2.0", method, params });
};

const getBroadcaster = (server) => {
  return (event, data) => {
    for (const client of server.clients) {
      if (client.readyState !== WebSocket.OPEN) continue;
      client.send(createEventMessage(event, data));
    }
  };
};

const parseMessage = (body) => {
  const data = JSON.parse(body);
  const { method, params, id } = data;
  if (!method)
    throw new Error(`Cannot found method in message: ${body.toString()}.`);
  return { method, params, id };
};

const getMessageHandler = (connection, broadcaster, methods) => {
  return async (message) => {
    try {
      const { method, params, id } = parseMessage(message);
      const call = methods[method];
      if (!call) throw new Error(`Method ${method} not found.`);
      const result = await call(params, broadcaster);
      if (result) connection.send(createMessage(result, id));
    } catch (error) {
      connection.send(createErrorMessage(error.message));
    }
  };
};

const handleConnection = (connection, broadcaster, methods) => {
  const handleMessage = getMessageHandler(connection, broadcaster, methods);
  const handleError = (error) => {
    console.log(`Error on the client connection: ${error.stack}`);
    connection.terminate();
  };

  const handleClose = () => {
    connection.removeListener("error", handleError);
    connection.removeListener("close", handleClose);
    connection.removeListener("message", handleMessage);
  };
  connection.on("message", handleMessage);
  connection.on("close", handleClose);
  connection.on("error", handleError);
};

module.exports = { handleConnection, getBroadcaster };
