import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {validationResult} from "express-validator";

import {registerValidator} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import UserModel from "./models/User.js";

mongoose.connect("mongodb+srv://ilyaxtom:zAnORxvSLDpGoaP6@cluster0.82rur.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

const app = express();


app.use(express.json());

app.post("/auth/register", registerValidator, async (req, res) => {
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
});

app.post("/auth/login", async (req, res) => {
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
});

app.get("/auth/me", checkAuth, async (req, res) => {
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
})

app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server running on port 8080");
});