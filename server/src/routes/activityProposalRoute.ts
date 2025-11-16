import { Router } from "express";
import {
    createActivityProposal,
    getActivityProposalById,
    getPendingActivityProposals,
    getApprovedActivityProposals,
    getRejectedActivityProposals,
    rejectApf,
    approveApf,
} from "../controllers/activityProposalController";
import { authenticateToken } from "../middlewares/authMiddleware";

const activityProposalRouter = Router();

activityProposalRouter.post("/", authenticateToken, createActivityProposal);

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
activityProposalRouter.patch("/reject/:id", authenticateToken, rejectApf);
activityProposalRouter.patch("/approve/:id", authenticateToken, approveApf);
activityProposalRouter.get("/:id", authenticateToken, getActivityProposalById);

export default activityProposalRouter;
