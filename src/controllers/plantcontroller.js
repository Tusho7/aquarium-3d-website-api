import Plant from "../models/Plant.js";

export const getAllPlants = async(req,res) => {
    const data = await Plant.find();
    const newData = data.map((plant) => {
        return {
            id: plant.id,
            name: plant.name,
            co2: plant.co2,
            growthRate: plant.growthRate,
            care: plant.care,
            light: plant.light,
            about: plant.about,
            size: plant.size,
            parameters: plant.parameters,
            images: plant.images
        }
    })
    return res.json(newData);
}