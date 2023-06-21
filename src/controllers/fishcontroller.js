import Fish from "../models/Fish.js"

export const getAllFish = async(req,res) => {
    const data = await Fish.find();
    const newData = data.map(document => {
        return {
            id: document.id,
            name: document.name,
            category: document.category,
            careLevel: document.careLevel,
            waterTemp: document.waterTemp,
            about: document.about,
            size: document.size,
            parameters: document.parameters,
            lifespan: document.lifespan,
            minimumTankSize: document.minimumTankSize,
            food: document.food,
            images: document.images
        }
    })
    return res.json(newData);
}