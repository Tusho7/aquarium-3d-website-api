import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIO } from "socket.io";

import connectToMongo from "./config/mongo.js";
import fishRouter from "./routes/fish-router.js";
import plantRouter from "./routes/plant-router.js";
import userRouter from "./routes/user-router.js";
import forumRouter from "./routes/forum-router.js";
import swaggerMiddleware from "./middlewares/swagger-middleware.js";
import exp from "constants";

dotenv.config();
connectToMongo();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors()); 
app.use(express.json());
app.use("/avatars", express.static("public/avatar"));
app.use("/images", express.static("public/storage"));
app.options("*", cors()); 

app.use("/api", fishRouter);
app.use("/api", plantRouter);
app.use("/api", userRouter);
app.use("/api", forumRouter);
app.use("/", ...swaggerMiddleware());

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chatMessage", (message) => {
    console.log("New chat message:", message);
    io.emit("chatMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
