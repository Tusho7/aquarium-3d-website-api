import bodyParser from "body-parser"
import express from "express"
import dotenv from "dotenv";

import connectToMongo from "./config/mongo.js";
import fishRouter from "./routes/fish-router.js";

const app = express();
dotenv.config();
connectToMongo();

app.use(bodyParser.json());

app.use("/api", fishRouter);

app.listen(3000);