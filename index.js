import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ilyaxtom:zAnORxvSLDpGoaP6@cluster0.82rur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

const app = express();


app.use(express.json());

app.post("/auth/register", (req, res) => {
    
});

app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server running on port 8080");
});