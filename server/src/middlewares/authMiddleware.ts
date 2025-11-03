import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];

    // if (!token) {
    //     return res.status(401).json({ message: "Access token is required" });
    // }

    // try {
    //     const decoded = jwt.verify(token, config.access_token as string) as {
    //         userId: number;
    //     };
    //     req.user = decoded;
    //     next();
    // } catch (error) {
    //     return res.status(403).json({ message: "Invalid or expired token" });
    // }
    const { accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is required" });
    }
    try {
        const decoded = jwt.verify(
            accessToken,
            config.access_token as string
        ) as {
            userId: number;
        };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
