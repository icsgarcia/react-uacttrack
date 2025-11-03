import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";
import config from "../config/config";
import { AuthRequest } from "../middlewares/authMiddleware";
import s3Client from "../services/s3Service";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const prisma = new PrismaClient();

const createPresignedUrlWithClient = ({ key }: { key: string }) => {
    if (!key) return null;

    const command = new GetObjectCommand({
        Bucket: config.aws_s3_bucket,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

const generateAccessToken = (userId: number) => {
    return jwt.sign({ userId }, config.access_token as Secret, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = (userId: number) => {
    return jwt.sign({ userId }, config.refresh_token as Secret, {
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
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

export const register = async (req: Request, res: Response) => {
    const { firstName, lastName, organizationId, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                organizationId,
                email,
                password: hashedPassword,
            },
        });

        // const accessToken = generateAccessToken(user.id);
        // const refreshToken = generateRefreshToken(user.id);
        // const expiryDate = new Date();
        // expiryDate.setDate(expiryDate.getDate() + 7);

        // await prisma.refreshToken.create({
        //     data: {
        //         token: refreshToken,
        //         userId: user.id,
        //         expiresAt: expiryDate,
        //     },
        // });

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
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                password: true,
                organizationId: true,
                Organization: {
                    select: {
                        name: true,
                        logo: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const logoUrl = user.Organization?.logo
            ? await createPresignedUrlWithClient({
                  key: user.Organization.logo,
              })
            : null;

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: expiryDate,
            },
        });

        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: "Login successful",
            user: {
                ...userWithoutPassword,
                logoUrl,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }
    try {
        const payload = jwt.verify(
            refreshToken,
            config.refresh_token as string
        ) as {
            userId: number;
        };

        const tokenRecord = await prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
                userId: payload.userId,
                revoked: false,
                expiresAt: { gt: new Date() },
            },
        });

        if (!tokenRecord) {
            return res
                .status(401)
                .json({ message: "Invalid or expired refresh token" });
        }

        const newAccessToken = generateAccessToken(payload.userId);
        const newRefreshToken = generateRefreshToken(payload.userId);

        await prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { revoked: true },
        });

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: payload.userId,
                expiresAt: expiryDate,
            },
        });

        setAccessTokenCookie(res, newAccessToken);
        setRefreshTokenCookie(res, newRefreshToken);

        res.json({
            message: "Token refreshed successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        await prisma.refreshToken.updateMany({
            where: { token: refreshToken, revoked: false },
            data: { revoked: true },
        });

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
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                organizationId: true,
                Organization: {
                    select: {
                        name: true,
                        logo: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const logoUrl = user.Organization?.logo
            ? await createPresignedUrlWithClient({
                  key: user.Organization.logo,
              })
            : null;

        res.status(200).json({
            user: {
                ...user,
                organization: {
                    ...user.Organization,
                    logoUrl,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};
