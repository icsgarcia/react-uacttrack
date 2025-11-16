import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import config from "../config/config";
import { AuthRequest } from "../middlewares/authMiddleware";
import s3Client from "../services/s3Service";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import User from "../models/userModel";
import { Organization } from "../types/Organization";

const createPresignedUrlWithClient = ({ key }: { key: string }) => {
    if (!key) return null;

    const command = new GetObjectCommand({
        Bucket: config.aws_s3_bucket,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

const generateAccessToken = (userId: string) => {
    return jwt.sign({ data: userId }, config.access_token as Secret, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ data: userId }, config.refresh_token as Secret, {
        expiresIn: "1d",
    });
};

const setAccessTokenCookie = (res: Response, accessToken: string) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

export const register = async (req: Request, res: Response) => {
    const { firstName, lastName, organizationId, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            organizationId,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate("organizationId");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const logoUrl = await createPresignedUrlWithClient({
            key: (user.organizationId as Organization).logo,
        });

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);

        const userObject = user.toObject() as any; // FIX THIS
        delete userObject.password;

        userObject.organizationId = {
            _id: (user.organizationId as Organization)._id,
            name: (user.organizationId as Organization).name,
            logo: logoUrl,
        };

        res.status(200).json({
            message: "Login successful",
            user: userObject,
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        res.clearCookie("refreshToken");
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out" });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId)
            .select("-password")
            .populate("organizationId");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const logoUrl = await createPresignedUrlWithClient({
            key: (user.organizationId as Organization).logo,
        });

        const userObject = user.toObject() as any; // FIX THIS
        delete userObject.password;

        userObject.organizationId = {
            _id: (user.organizationId as Organization)._id,
            name: (user.organizationId as Organization).name,
            logo: logoUrl,
        };

        res.status(200).json({
            message: "Profile fetched successfully",
            user: userObject,
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
};
