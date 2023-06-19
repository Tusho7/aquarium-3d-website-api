import express from "express";
import { getAllFish } from "../controllers/fishcontroller.js";

const fishRouter = express.Router();

fishRouter.get('/fish', getAllFish);

export default fishRouter