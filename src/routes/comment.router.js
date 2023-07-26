import express from "express";
import { createComment } from "../controllers/commentcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";

const commentRouter = express.Router();

// Route to create a top-level comment in the topic
commentRouter.post("/:topicId/comments", authenticate, createComment);

// Route to create a reply to an existing comment
commentRouter.post("/:topicId/comments/:parentCommentId/replies", authenticate, createComment);

export default commentRouter;
