const cors = require("cors");
const app = require("express")();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");

app.use(cors());
const socket_io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
  },
});

socket_io.on("connection", (socket: { id: string }) => {
  console.log(socket.id);

  socket_io.on("disconnect", (socket: { id: string }) => {
    console.log(`user disconnected ${socket.id}`);
  });
});

httpServer.listen(3005, () => {
  console.log(`server listening on port 3005`);
});
