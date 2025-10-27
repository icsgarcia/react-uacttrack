import { Router } from "express";
import {
    createActivityProposal,
    getActivityProposals,
} from "../controllers/activityProposalController";
import { authenticateToken } from "../middlewares/authMiddleware";

const activityProposalRouter = Router();

activityProposalRouter.post(
    "/create",
    authenticateToken,
    createActivityProposal
);

activityProposalRouter.get("/", authenticateToken, getActivityProposals);

export default activityProposalRouter;
