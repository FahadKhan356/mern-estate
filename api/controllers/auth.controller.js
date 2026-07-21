import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    try {
        const { username, userName, email, password } = req.body;
        const finalUserName = userName ?? username;

        if (!finalUserName || !email || !password) {
            return res.status(400).json({ message: "userName, email and password are required" });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            userName: finalUserName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json("user created successfully!");
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0] || 'field';
            return res.status(409).json({
                success: false,
                message: `${field} already exists`,
            });
        }
        next(error);
    }
};