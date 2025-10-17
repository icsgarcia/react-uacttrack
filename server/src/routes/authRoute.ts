import { Router } from "express";
import {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);
authRouter.get("/profile", authenticateToken, getProfile);

export default authRouter;
