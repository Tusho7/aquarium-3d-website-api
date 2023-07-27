import express from "express";
import { createTopic } from "../controllers/forumcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";
import { deleteTopic } from "../controllers/forumcontroller.js";
import { likeTopic } from "../controllers/forumcontroller.js";
import { editTopic } from "../controllers/forumcontroller.js";

const forumRouter = express.Router();

forumRouter.post("/topics", authenticate, createTopic);
forumRouter.delete("/topics/:topicId", authenticate, deleteTopic);
forumRouter.post("/topics/:topicId/like", authenticate, likeTopic);
forumRouter.put("/topics/:topicId", authenticate, editTopic); 

export default forumRouter;
