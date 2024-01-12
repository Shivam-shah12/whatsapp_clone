import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/document",express.static("uploads/document"))
app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);
const PORT=process.env.PORT || 8000

server.listen(process.env.PORT, () => {
  console.log(`server is running at PORT Number ${PORT} `);
});

const io = new Server(server, {
  cors: {
    origin: "https://chatwebapplication.vercel.app/",
  },
});

const users = new Map();

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  users.set(socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined room " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived;
    if (!chat.message.senderId && !chat.message.receiverId)
      return console.log("chat.senderId & chat.receiverId is not defined");
    io.to(chat.message.receiverId).emit("message received", {
      from: chat.message.senderId,
      message: chat,
    });
  });

  socket.on("outgoing-voice-call", (data ) => {
    console.log(data);
    const sendUserSocket = data.to;

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call" , {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
    // acknowledgment({ status: "failure" });
  });

  socket.on("outgoing-video-call", (data) => {
    console.log(data);
    const sendUserSocket = data.to;

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = data.from;
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("reject-video-call", (data) => {
    
    const sendUserSocket = data.from;
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });

  socket.on("accept-incoming-call", (id ) => {
    console.log("incoming call = "+id);
    const sendUserSocket = id;
    socket.to(sendUserSocket).emit("accept-call",true);
  });


});
