import express from "express";
import { createTopic } from "../controllers/forumcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";
import { deleteTopic } from "../controllers/forumcontroller.js";

const forumRouter = express.Router();

forumRouter.post("/topics", authenticate, createTopic);
forumRouter.delete("/topics/:topicId", authenticate, deleteTopic);

export default forumRouter;
