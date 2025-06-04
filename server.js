const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const itemRoutes = require("./routes/items");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/items", itemRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

console.log("WebSocket server initialized.");

const heartbeatInterval = 30000;

function noop() {}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(wsClient) {
    if (wsClient.isAlive === false) {
      console.log(
        `Terminating dead client connection (no pong received). Remote: ${wsClient._socket?.remoteAddress}`
      );
      return wsClient.terminate();
    }

    wsClient.isAlive = false;
    wsClient.ping(noop);
  });
}, heartbeatInterval);

wss.on("close", function close() {
  clearInterval(interval);
  console.log("WebSocket server closed, heartbeat interval cleared.");
});

global.broadcast = (data) => {
  if (!wss || !wss.clients) {
    console.warn("WebSocket server or clients not available for broadcast.");
    return;
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error("Error sending message to client:", error);
      }
    }
  });
};

global.broadcastActiveUsersCount = () => {
  if (!wss || !wss.clients) {
    console.warn(
      "WebSocket server or clients not available for active user count."
    );
    return;
  }
  global.broadcast({
    type: "ACTIVE_USERS_COUNT",
    count: wss.clients.size,
  });
};

wss.on("connection", (ws, req) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  const clientIp = req.socket.remoteAddress || req.headers["x-forwarded-for"];
  console.log(
    `Client connected from ${clientIp}. Total clients: ${wss.clients.size}`
  );

  ws.send(
    JSON.stringify({
      type: "ACTIVE_USERS_COUNT",
      count: wss.clients.size,
    })
  );
  global.broadcastActiveUsersCount();

  ws.on("message", (message) => {
    console.log(`Received message from ${clientIp}: %s`, message);
  });

  ws.on("close", (code, reason) => {
    const reasonString = reason ? reason.toString() : "No reason provided";
    console.log(
      `Client from ${clientIp} disconnected. Code: ${code}, Reason: "${reasonString}". Total clients: ${wss.clients.size}`
    );
    global.broadcastActiveUsersCount();
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error on client ${clientIp}:`, error);
  });
});

app.use((err, req, res, next) => {
  console.error("Express error handler:", err.stack);
  res.status(500).send("Something broke!");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is listening on the same port.`);
});

process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
  console.error(err.stack);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error(err.stack);
});
