import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
            return res.status(409).json({ message: "A user with this userName or email already exists." });
        }
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};