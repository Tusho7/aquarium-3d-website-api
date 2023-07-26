import express from "express";
import { createComment } from "../controllers/commentcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";

const commentRouter = express.Router();

commentRouter.post("/:topicID/comments", authenticate, createComment);

export default commentRouter;