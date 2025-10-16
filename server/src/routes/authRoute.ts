import { Router } from "express";
import {
    register,
    login,
    refreshToken,
    logout,
} from "../controllers/userController";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
