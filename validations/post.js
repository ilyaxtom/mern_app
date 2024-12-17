import {body} from "express-validator";

export const postCreateValidator = [
    body("title", "Enter title").isLength({min: 3}).isString(),
    body("text", "Enter post test").isLength({min: 3}).isString(),
    body("tags", "Invalid tags format").optional().isString(),
    body("imageUrl", "Invalid image url").optional().isString(),
];