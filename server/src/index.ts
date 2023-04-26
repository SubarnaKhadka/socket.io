const cors = require("cors");
const app = require("express")();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");
interface ISocket {
  on: (event: string, callback: (args: any) => void) => void;
  id: string;
}

app.use(cors());
const socketIO = new Server(httpServer, {
  cors: {
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
  },
});

let users: Array<{ userId: string; socketId: string }> = [];

const addUserToSocket = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUserFromSocket = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUserFromSocket = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

socketIO.on("connection", (socket: ISocket) => {
  socket.on("addUserToSocket", (userId) => {
    addUserToSocket(userId as string, socket.id);
    socketIO.emit("getSocketUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUserFromSocket(receiverId as string);
    socketIO.to(user?.socketId).emit("getMessage", {
      senderId: senderId as string,
      text: text as string,
    });
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    removeUserFromSocket(socket.id);
    socketIO.emit("getSocketUsers", users);
  });
});

httpServer.listen(3005, () => {
  console.log(`server listening on port 3005`);
});
