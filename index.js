import express from "express";
import mongoose from "mongoose";

import {loginValidator, registerValidator} from "./validations/auth.js";
import {postCreateValidator} from "./validations/post.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import Post from "./models/Post.js";

mongoose.connect("mongodb+srv://ilyaxtom:zAnORxvSLDpGoaP6@cluster0.82rur.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

const app = express();


app.use(express.json());

app.post("/auth/login", loginValidator, UserController.login);
app.post("/auth/register", registerValidator, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidator, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
// app.patch("/posts", PostController.update);

app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server running on port 8080");
});