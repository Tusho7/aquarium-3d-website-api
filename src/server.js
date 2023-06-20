import bodyParser from "body-parser"
import express from "express"
import dotenv from "dotenv";
import cors from "cors";

import connectToMongo from "./config/mongo.js";
import fishRouter from "./routes/fish-router.js";
import plantRouter from "./routes/plant-router.js";
import swaggerMiddleware from "./middlewares/swagger-middleware.js";

const app = express();
dotenv.config();
connectToMongo();

app.use(bodyParser.json());

app.use(cors());
app.use("/images", express.static("public/storage"));
app.use("/api", fishRouter);
app.use("/api", plantRouter);
app.use("/", ...swaggerMiddleware());

app.listen(process.env.PORT || 3000);