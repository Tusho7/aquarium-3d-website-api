import Topic from "../models/Topic.js";
import mongoose from "mongoose";

export const createTopic = (req, res) => {
  const { title, content } = req.body;
  const createdBy = req.user.id;

  const newTopic = new Topic({
    title,
    content,
    createdBy: createdBy,
  });

  newTopic
    .save()
    .then((savedTopic) => {
      res.status(201).json({ message: "Topic created successfully", topic: savedTopic });
    })
    .catch((error) => {
      console.error("Error creating topic:", error);
      res.status(500).json({ error: "Unable to create topic. An error occurred while saving." });
    });
};
