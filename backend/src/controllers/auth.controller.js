import bcrypt from "bcrypt";
import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
    generateAccessToken,
} from "../utils/generateToken.js";



export const registerUser = asyncHandler(
async (req, res) => {

    const {
        name,
        email,
        password,
        role,
        department,
    } = req.body;

    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            409,
            "User already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user =
        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department,
        });

    const createdUser =
        await User.findById(user._id)
            .select("-password");

    res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            createdUser
        )
    );

});



export const loginUser = asyncHandler(
async (req, res) => {

    const {
        email,
        password,
    } = req.body;

    const user =
        await User.findOne({ email });

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isPasswordCorrect =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const token =
        generateAccessToken(user);

    const loggedInUser =
        await User.findById(user._id)
            .select("-password");

    res
        .status(200)
        .cookie(
            "accessToken",
            token,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "strict",
            }
        )
        .json(
            new ApiResponse(
                200,
                "Login successful",
                {
                    user: loggedInUser,
                    token,
                }
            )
        );

});



export const getCurrentUser =
asyncHandler(async (req, res) => {

    res.status(200).json(
        new ApiResponse(
            200,
            "Current user fetched",
            req.user
        )
    );

});



export const logoutUser =
asyncHandler(async (req, res) => {

    res
        .status(200)
        .clearCookie("accessToken")
        .json(
            new ApiResponse(
                200,
                "Logout successful"
            )
        );

});