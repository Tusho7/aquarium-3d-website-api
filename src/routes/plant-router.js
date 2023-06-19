import express from "express";
import { getAllPlants } from "../controllers/plantcontroller.js";

const plantRouter = express.Router();

plantRouter.get("/plant", getAllPlants);

export default plantRouter