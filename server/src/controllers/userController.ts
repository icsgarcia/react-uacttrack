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
        expiresIn: "7d",
    });
};

export const register = async (req: Request, res: Response) => {
    const { firstName, lastName, organizationId, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                organizationId,
                email,
                password: hashedPassword,
            },
        });
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: expiryDate,
            },
        });

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
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const organization = await prisma.organization.findUnique({
            where: { id: user.organizationId },
            select: { id: true, name: true, logo: true },
        });

        // if (organization && organization.logo) {
        //     logoUrl = `https://${config.aws_s3_bucket}.s3.${config.aws_region}.amazonaws.com/${organization.logo}`;
        // }

        const logoUrl = await createPresignedUrlWithClient({
            key: organization?.logo || "",
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: expiryDate,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: "Login successful",
            user: {
                ...userWithoutPassword,
                organization: { ...organization, logoUrl },
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user" });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

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
        expiryDate.setDate(expiryDate.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: payload.userId,
                expiresAt: expiryDate,
            },
        });

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        await prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { revoked: true },
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
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};
