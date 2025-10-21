import { Router } from "express";
import { createActivityProposal } from "../controllers/activityProposalController";
import { authenticateToken } from "../middlewares/authMiddleware";
import multer from "multer";
const activityProposalRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

activityProposalRouter.post(
    "/create",
    authenticateToken,
    upload.fields([
        { name: "cashForm", maxCount: 1 },
        { name: "foodForm", maxCount: 1 },
        { name: "supplyForm", maxCount: 1 },
        { name: "reproductionForm", maxCount: 1 },
        { name: "otherForm", maxCount: 1 },
    ]),
    createActivityProposal
);

export default activityProposalRouter;
