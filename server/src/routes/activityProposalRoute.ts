import { Router } from "express";
import {
    createActivityProposal,
    getActivityProposalById,
    getPendingActivityProposals,
    getApprovedActivityProposals,
    getRejectedActivityProposals,
} from "../controllers/activityProposalController";
import { authenticateToken } from "../middlewares/authMiddleware";

const activityProposalRouter = Router();

activityProposalRouter.post(
    "/create",
    authenticateToken,
    createActivityProposal
);

activityProposalRouter.get(
    "/pending",
    authenticateToken,
    getPendingActivityProposals
);
activityProposalRouter.get(
    "/approved",
    authenticateToken,
    getApprovedActivityProposals
);
activityProposalRouter.get(
    "/rejected",
    authenticateToken,
    getRejectedActivityProposals
);
activityProposalRouter.get("/:id", authenticateToken, getActivityProposalById);

export default activityProposalRouter;
