import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const { file } = req;

  if (!email || !password) {
    return res.status(400).json({ error: "Enter all required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const exist = await User.findOne({ email });
  if (exist) {
    return res
      .status(400)
      .json({ error: "An account with this email already exists" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password should be at least 8 characters" });
  }

  if (!/[a-z]/.test(password)) {
    return res
      .status(400)
      .json({ error: "Password should contain at least one lowercase" });
  }

  if (!/[A-Z]/.test(password)) {
    return res
      .status(400)
      .json({ error: "Password should contain at least one uppercase" });
  }

  if (!/\d/.test(password)) {
    return res
      .status(400)
      .json({ error: "Password should contain at least one number" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    avatar: "avatars/" + file.originalname,
    id: uuidv4(),
  });

  const saveUser = await newUser.save();

  res.status(201).send({ user: saveUser });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Enter all required fields" });
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({ error: "Wrong email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Wrong email or password " });
  } else {
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        avatar: existingUser.avatar,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(201).json({
      message: "Login Successfully",
      token,
    });
  }
};

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send("Access denied. No token provided");
  }

  const [, token] = auth.trim().split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

export const authenticateUser = (req, res, next) => {
  const auth = req.header("Authorization");

  if (!auth) {
    return res.status(401).send("Access denied. No token provided");
  }

  const [, token] = auth.trim().split(" ");
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return res.status(200).json(decoded);
};

export const logOut = (req, res) => {
  res.status(200).json({ message: "Logout Successful" });
};
