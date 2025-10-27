import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
    presignUploads,
    presignDownload,
} from "../controllers/uploadController";

const uploadRouter = Router();

uploadRouter.post("/presign", authenticateToken, presignUploads);
uploadRouter.get("/presign-download", authenticateToken, presignDownload);

export default uploadRouter;
