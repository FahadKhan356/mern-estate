import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "username, email and password are required",
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ userName, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully!",
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0] || "field";
            return res.status(409).json({
                success: false,
                message: `${field} already exists`,
            });
        }
        next(error);
    }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(401, "Wrong credentials!"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials!"));
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;

        res
            .cookie("access_token", token, { httpOnly: true, })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};