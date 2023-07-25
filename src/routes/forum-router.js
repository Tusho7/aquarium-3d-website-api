import express from "express";
import { createTopic } from "../controllers/forumcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";

const forumRouter = express.Router();

forumRouter.post("/topics", authenticate, createTopic);

export default forumRouter
