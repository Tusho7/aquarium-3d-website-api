import Plant from "../models/Plant.js";

export const getAllPlants = async(req,res) => {
    const data = await Plant.find();
    return res.json(data);
}