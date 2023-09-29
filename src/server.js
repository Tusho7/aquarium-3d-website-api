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
import commentRouter from "./routes/comment.router.js";

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
app.use("/api", commentRouter);
app.use("/", ...swaggerMiddleware());

io.on("connection", (socket) => {
  console.log("A user connected");

socket.on("chatQuestion", (question) => {
  console.log("New chat question:", question);

  let response = "";
  if(question === "რა მოწყობილობები მჭირდება აკვარიუმის გაშვებისთვის?") {
    response ="აკვარიუმის გაშვებისთვის საჭიროა: აკვარიუმი, გრუნტი, ფილტრი, გამათბობელი და სასურველია განათება."
  }else if (question === "როგორ გავუშვა აკვარიუმი?") {
    response = "აკვარიუმში ჩაყარეთ გრუნტი, ჩაასხით წყალი, ჩარგეთ მცენარეები, დააყენეთ ყველა მოწყობილობა(ფილტრი,გამათბობელი და ა.შ) და დაელოდეთ ბალანსის შექმნას, დაახლოებით 1-2კვირა."
  }else if (question === "თევზის რომელ სახეობას მირჩვთ დამწყებისთვის?") {
    response = "დამწყებისთვის სასურველია თბილი წყლის მშვიდობიანი თევზები, რომლებიც მარტივია მოსავლელად."
  }else {
    response = "ვწუხვარ ამ კითხვაზე პასუხი არ მაქვს :("
  }
    io.emit("chatMessage", response);
  })

  socket.on("newTopicDetail", (topicDetail) => {
    io.emit("topicDetailUpdate", topicDetail);
  });

  socket.on("like", (data) => {
    io.emit("like", data);
  })
  socket.on("newComment", (comment) => {
    io.emit("commentUpdate", comment);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
