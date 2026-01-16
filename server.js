const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const users = {};

io.on("connection", (socket) => {
  console.log("Conectado:", socket.id);

  socket.on("join", (nickname) => {
    users[socket.id] = {
      id: socket.id,
      nickname,
      isVip: false
    };

    io.emit("users:update", Object.values(users));
    io.emit("public:message", {
      system: true,
      message: `${nickname} entrou no chat`
    });
  });

  socket.on("public:message", (msg) => {
    if (!users[socket.id]) return;

    io.emit("public:message", {
      user: users[socket.id].nickname,
      message: msg
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("public:message", {
        system: true,
        message: `${users[socket.id].nickname} saiu`
      });
    }
    delete users[socket.id];
    io.emit("users:update", Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log("Servidor rodando na porta", PORT)
);
