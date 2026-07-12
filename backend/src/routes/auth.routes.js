
import { Router } from "express";

import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    registerSchema,
    loginSchema,
} from "../validators/auth.validator.js";

const router = Router();

// Public Routes
router.post(
    "/register",
    validate(registerSchema),
    registerUser
);

router.post(
    "/login",
    validate(loginSchema),
    loginUser
);

// Protected Routes
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

router.post(
    "/logout",
    authMiddleware,
    logoutUser
);

export default router;