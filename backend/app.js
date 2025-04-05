const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const https = require("https"); // changed from http
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { Server } = require("socket.io");
const nm = require("nodemailer");
const bodyParser = require("body-parser");

// Self-signed certs
const key = fs.readFileSync("./key.pem");
const cert = fs.readFileSync("./cert.pem");

const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  LEAVE: "leave",
};

const userSocketMap = {};

const app = express();
const port = process.env.PORT || 3001;
app.set("port", port);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create HTTPS server
const server = https.createServer({ key, cert }, app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"],
  },
});

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return { socketId, username: userSocketMap[socketId] };
  });
};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    console.log(`User ${username} joined room ${roomId}`);
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });
});

// Start HTTPS server
server.listen(port, () => {
  console.log(`🔐 Secure server running at https://<your-ec2-ip>:${port}`);
});
