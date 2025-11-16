import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return res
                .status(401)
                .json({ message: "Access token is required" });
        }

        const decoded = jwt.verify(
            accessToken,
            config.access_token as string
        ) as {
            data: string;
        };
        req.userId = decoded.data;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
