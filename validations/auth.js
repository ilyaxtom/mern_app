import { body } from "express-validator";

export const registerValidator = [
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be at least 5 symbols").isLength({min: 5}),
    body("name", "Type at least 1 symbol").isLength({min: 1}),
    body("avatarUrl", "Invalid url").optional().isURL(),
];

export const loginValidator = [
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be at least 5 symbols").isLength({min: 5}),
]