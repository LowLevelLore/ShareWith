const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { Server } = require("socket.io");
const nm = require("nodemailer");

var bodyParser = require("body-parser");

const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  LEAVE: "leave",
};

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return { socketId, username: userSocketMap[socketId] };
    }
  );
};

const app = express();
app.use(cors());
app.use(bodyParser());
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    let clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
    console.log(clients);
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
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code: code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });
});

const PORT = process.env.PORT || 5000;
const MAIL = "hacknuthon5@gmail.com";
const PASSWORD = "lpxw vbkm nzzl ybid";

const trasport = nm.createTransport({
  service: "gmail",
  auth: {
    user: MAIL,
    pass: PASSWORD,
  },
});

server.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`);
});

app.post("/sendmail", async (req, res) => {
  console.log("Recieved");
  const res_ = await trasport.sendMail({
    subject: `${req.body.mail} : ${req.body.subject}`,
    from: "hacknuthon5@gmail.com",
    to: "hacknuthon5@gmail.com",
    text: req.body.body,
  });
  res.send(res_);
});

module.exports = app;
