import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIO } from "socket.io";

import connectToMongo from "./config/mongo.js";
import fishRouter from "./routes/fish-router.js";
import plantRouter from "./routes/plant-router.js";
import swaggerMiddleware from "./middlewares/swagger-middleware.js";

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

app.use(express.json());
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
      case "რა მოწყობილობები მჭირდება აკვარიუმის გაშვებისთვის?":
        response =
          "აკვარიუმის გასაშვებად საჭიროა აკვარიუმი, გრუნტი, ფილტრი, გამათბობელი, განათება.";
        break;
      case "როგორ გავუშვა აკვარიუმი?":
        response =
          "აკვარიუმში ჩაყარეთ გრუნტი, (ჩარგეთ მცენარეები), ჩაასხით წყალი, ჩართეთ ფილტრი, გამათბობელი და გათბობა და დაელოდეთ 1-2 კვირა ბალანსის ჩამოყალიბებას.";
        break;
      case "თევზის რომელ სახეობას მირჩვთ დამწყებისთვის?":
        response =
          "დამწყებისთვის უფრო მარტივი თევზებია თბილის წყლის სვიდობიანი თევზები როგორიცაა: ტერნეცია, დანიო, გუპი და ა.შ.";
        break;
      case "რამდენად ხშირად უნდა გამოვკვებო თევზი?":
        response =
          "თევზისთვის ბევრი საჭმელი მომაკვდინებელია უმჯობესია დღეში ერთხელ და ცოტა.";
        break;
      case "რა დეკორაციის გამოყენებას მირჩევთ?":
        response =
          "დეკორაცია შეიძლება დამუშავებული ხის ფესვები, ქვევრი, ქვები (არ გამოიყენოთ შეღებილი დეკორაციები).";
        break;
      case "როგორ და რა სიხშირით გამოვცვალო წყალი?":
        response =
          "წყალი უმჯობესია გამოიცვალოს კვირაში ერთხელ მთლიანი მოცულობის 30% და დაემატოს ნადგამი.";
        break;
      default:
        response = "ვწუხავარ ამ კითხვაზე პასუხი არ მაქვს.😥";
    }

    socket.emit("chatMessage", { message: response, question });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
