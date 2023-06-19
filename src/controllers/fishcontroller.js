import Fish from "../models/Fish.js"

export const getAllFish = async(req,res) => {
    const data = await Fish.find();
    return res.json(data);
}