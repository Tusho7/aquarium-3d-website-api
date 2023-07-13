import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const signup = async (req,res) => {
    const { email, password } = req.body;
    const { file } = req;

    if(!email || !password) {
        return res.status(400).json({ error: "Enter all required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    const exist = await User.findOne({ email });
    if(exist) {
        return res.status(400).json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword,
        avatar: "avatars/" + file.originalname,
        id: uuidv4,
    });

    const saveUser = await newUser.save();

    res.status(201).send({ user: saveUser });
}