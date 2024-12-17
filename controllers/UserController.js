import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.passwordHash);

        if (!isValidPassword) {
            return res.status(404).json({
                message: "Invalid login or password",
            })
        }

        const token = jwt.sign({
                id: user._id,
            },
            'secret',
            {
                expiresIn: "30d"
            });

        const {passwordHash, ...userData} = user;

        return res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Unable to login",
        })
    }
};

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const doc = new UserModel({
            name: req.body.name,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id,
            },
            'secret',
            {
                expiresIn: "30d"
            });

        const {passwordHash, ...userData} = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Unable to register",
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            })
        }

        const {passwordHash, ...userData} = user;
        return res.json({
            ...userData,
        })
    } catch(error) {

    }
};