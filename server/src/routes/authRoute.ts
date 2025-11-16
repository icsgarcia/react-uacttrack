import { Router } from "express";
import {
    register,
    login,
    logout,
    getProfile,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", authenticateToken, getProfile);

export default authRouter;
