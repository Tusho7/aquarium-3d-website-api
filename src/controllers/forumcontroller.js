import moment from "moment-timezone";
import Topic from "../models/Topic.js";

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
      const timezone = "Asia/Tbilisi";
      const createdAtLocal = moment(savedTopic.createdAt).tz(timezone).format();
      const responseTopic = {
        ...savedTopic.toObject(),
        createdAt: createdAtLocal,
      };

      res
        .status(201)
        .json({ message: "Topic created successfully", topic: responseTopic });
    })
    .catch((error) => {
      console.error("Error creating topic:", error);
      res.status(500).json({
        error: "Unable to create topic. An error occurred while saving.",
      });
    });
};

export const deleteTopic = async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user.id;

  try {
    const topic = await Topic.findOne({ _id: topicId, createdBy: userId });
    if (!topic) {
      return res
        .status(404)
        .json({
          error: "Topic not found or you do not have permission to delete it.",
        });
    }

    await topic.deleteOne();
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res
      .status(500)
      .json({
        error: "Unable to delete topic. An error occurred while deleting.",
      });
  }
};
