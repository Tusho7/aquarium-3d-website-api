import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import socketio from "socket.io";

import connectToMongo from "./config/mongo.js";
import fishRouter from "./routes/fish-router.js";
import plantRouter from "./routes/plant-router.js";
import swaggerMiddleware from "./middlewares/swagger-middleware.js";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

dotenv.config();
connectToMongo();

app.use(bodyParser.json());

app.use(cors());
app.use("/images", express.static("public/storage"));
app.use("/api", fishRouter);
app.use("/api", plantRouter);
app.use("/", ...swaggerMiddleware());

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chatMessage", (message) => {
    console.log("New chat message:", message);
    io.emit("chatMessage", message);
  });

  socket.on("chatQuestion", (question) => {
    console.log("New chat question:", question);

    let response;
    switch (question) {
      case "How are you?":
        response = "OK, you?";
        break;
      case "What do you suggest?":
        response = "Fishes and fishes";
        break;
      case "When was the site started?":
        response = "1 month ago";
        break;
      default:
        response = "I'm sorry, I don't have an answer for that.";
    }

    io.emit("chatMessage", response);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
