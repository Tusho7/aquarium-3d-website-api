import express from "express";
import { createTopic, getTopicDetails, getUserTopics } from "../controllers/forumcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";
import { deleteTopic } from "../controllers/forumcontroller.js";
import { likeTopic } from "../controllers/forumcontroller.js";
import { editTopic } from "../controllers/forumcontroller.js";
import { topicCreationRateLimit } from "../controllers/forumcontroller.js";
import { getAllTopicTitles } from "../controllers/forumcontroller.js";

const forumRouter = express.Router();

forumRouter.get("/getAllTopics", getAllTopicTitles);
forumRouter.get("/user-topics", authenticate, getUserTopics);
forumRouter.get("/topics/:topicTitle", getTopicDetails);
forumRouter.post("/topics", authenticate, topicCreationRateLimit, createTopic);
forumRouter.delete("/topics/:topicId", authenticate, deleteTopic);
forumRouter.post("/topics/:topicId/like", authenticate, likeTopic);
forumRouter.put("/topics/:topicId", authenticate, editTopic); 

export default forumRouter;
