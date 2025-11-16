import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../services/s3Service";
import config from "../config/config";
import Activity from "../models/activityModel";
import User from "../models/userModel";

interface PresignedUrlParams {
    bucket: string;
    key: string;
}

const createPresignedUrlWithClient = ({ bucket, key }: PresignedUrlParams) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const createActivityProposal = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const {
            cashForm,
            foodForm,
            supplyForm,
            reproductionForm,
            otherForm,
            attendees,
            date,
            startTime,
            endTime,
            venueId,
            title,
            participants,
            purpose,
            requirements,
        } = req.body;

        if (
            !attendees ||
            !date ||
            !startTime ||
            !endTime ||
            !venueId ||
            !title ||
            !participants ||
            !purpose ||
            !requirements
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await User.findById(userId).select("organizationId");

        const activityProposal = new Activity({
            title,
            purpose,
            participants,
            attendees,
            requirements,
            date: date as Date,
            startTime,
            endTime,
            cashForm,
            foodForm,
            supplyForm,
            reproductionForm,
            otherForm,
            venueId,
            userId,
            organizationId: user?.organizationId,
        });

        await activityProposal.save();

        res.status(201).json({
            message: "Activity Proposal created successfully",
        });
    } catch (error) {
        console.error("Error creating Activity Proposal:", error);
        res.status(500).json({
            message: `Error creating Activity Proposal: ${error}`,
        });
    }
};

export const getPendingActivityProposals = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.userId;
        let pendingAPF;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(userId).select("role organizationId");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "STUDENT" || user.role === "HEAD") {
            pendingAPF = await Activity.find({
                status: "PENDING",
                organizationId: user.organizationId,
            }).select("title updatedAt");
        } else if (user.role === "OSA") {
            pendingAPF = await Activity.find({
                status: "PENDING",
            }).select("title updatedAt");
        } else if (user.role === "VPA") {
            pendingAPF = await Activity.find({
                headStatus: "APPROVED",
                osaStatus: "APPROVED",
                status: "PENDING",
            }).select("title updatedAt");
        } else if (user.role === "VPAA") {
            pendingAPF = await Activity.find({
                headStatus: "APPROVED",
                osaStatus: "APPROVED",
                vpaStatus: "APPROVED",
                status: "PENDING",
            }).select("title updatedAt");
        }

        res.status(200).json(pendingAPF);
    } catch (error) {
        console.error("Error fetching Activity Proposals:", error);
        res.status(500).json({
            message: "Error fetching Activity Proposals",
        });
    }
};

export const getApprovedActivityProposals = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        let approvedAPF;

        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(userId).select("role organizationId");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "STUDENT" || user.role === "HEAD") {
            approvedAPF = await Activity.find({
                status: "APPROVED",
                organizationId: user.organizationId,
            }).select("title updatedAt");
        } else {
            approvedAPF = await Activity.find({
                status: "APPROVED",
            }).select("title updatedAt");
        }

        res.status(200).json(approvedAPF);
    } catch (error) {
        console.error("Error fetching Activity Proposals:", error);
        res.status(500).json({
            message: "Error fetching Activity Proposals",
        });
    }
};

export const getRejectedActivityProposals = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        let rejectedAPF;

        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(userId).select("role organizationId");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "STUDENT" || user.role === "HEAD") {
            rejectedAPF = await Activity.find({
                status: "REJECTED",
                organizationId: user.organizationId,
            }).select("title updatedAt");
        } else {
            rejectedAPF = await Activity.find({
                status: "REJECTED",
            }).select("title updatedAt");
        }

        res.status(200).json(rejectedAPF);
    } catch (error) {
        console.error("Error fetching Activity Proposals:", error);
        res.status(500).json({
            message: "Error fetching Activity Proposals",
        });
    }
};

export const getActivityProposalById = async (
    req: AuthRequest,
    res: Response
) => {
    const { id } = req.params;
    try {
        const activityProposal = await Activity.findById(id).populate(
            "organizationId venueId userId"
        );

        if (!activityProposal) {
            return res
                .status(404)
                .json({ message: "Activity Proposal not found" });
        }

        const cashFormFile = await createPresignedUrlWithClient({
            bucket: config.aws_s3_bucket,
            key: String(activityProposal.cashForm),
        });

        const foodFormFile = await createPresignedUrlWithClient({
            bucket: config.aws_s3_bucket,
            key: String(activityProposal.foodForm),
        });

        const supplyFormFile = await createPresignedUrlWithClient({
            bucket: config.aws_s3_bucket,
            key: String(activityProposal.supplyForm),
        });

        const reproductionFormFile = await createPresignedUrlWithClient({
            bucket: config.aws_s3_bucket,
            key: String(activityProposal.reproductionForm),
        });

        const otherFormFile = await createPresignedUrlWithClient({
            bucket: config.aws_s3_bucket,
            key: String(activityProposal.otherForm),
        });

        const apf = activityProposal.toObject() as any; // FIX THIS

        delete apf.cashForm;
        delete apf.foodForm;
        delete apf.supplyForm;
        delete apf.reproductionForm;
        delete apf.otherForm;

        apf.files = {
            cashFormFile,
            foodFormFile,
            supplyFormFile,
            reproductionFormFile,
            otherFormFile,
        };

        res.status(200).json(apf);
    } catch (error) {
        res.status(500).json({
            message: `Error fetching Activity Proposal: ${error}`,
        });
    }
};

export const approveApf = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const activityProposal = await Activity.findById(id);
        if (!activityProposal) {
            return res
                .status(404)
                .json({ message: "Activity Proposal not found" });
        }

        switch (user.role) {
            case "HEAD":
                activityProposal.headStatus = "APPROVED";
                break;
            case "OSA":
                activityProposal.osaStatus = "APPROVED";
                break;
            case "VPA":
                activityProposal.vpaStatus = "APPROVED";
                break;
            case "VPAA":
                activityProposal.vpaaStatus = "APPROVED";
                break;
            default:
                return res.status(403).json({ message: "Unauthorized action" });
        }

        if (
            activityProposal.headStatus === "APPROVED" &&
            activityProposal.osaStatus === "APPROVED" &&
            activityProposal.vpaStatus === "APPROVED" &&
            activityProposal.vpaaStatus === "APPROVED"
        ) {
            activityProposal.status = "APPROVED";
        }

        await activityProposal.save();

        res.status(200).json({
            message: "Activity Proposal approved successfully",
        });
    } catch (error) {
        console.error("Error approving Activity Proposal:", error);
        res.status(500).json({
            message: `Error approving Activity Proposal: ${error}`,
        });
    }
};

export const rejectApf = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const activityProposal = await Activity.findById(id);
        if (!activityProposal) {
            return res
                .status(404)
                .json({ message: "Activity Proposal not found" });
        }

        if (
            activityProposal.status === "REJECTED" ||
            activityProposal.status === "APPROVED"
        ) {
            return res.status(400).json({
                message:
                    "Cannot reject an already approved or rejected proposal.",
            });
        }

        switch (user.role) {
            case "HEAD":
                activityProposal.headStatus = "REJECTED";
                break;
            case "OSA":
                activityProposal.osaStatus = "REJECTED";
                break;
            case "VPA":
                activityProposal.vpaStatus = "REJECTED";
                break;
            case "VPAA":
                activityProposal.vpaaStatus = "REJECTED";
                break;
            default:
                return res.status(403).json({ message: "Unauthorized action" });
        }

        activityProposal.status = "REJECTED";

        await activityProposal.save();

        res.status(200).json({
            message: "Activity Proposal rejected successfully",
        });
    } catch (error) {
        console.error("Error rejecting Activity Proposal:", error);
        res.status(500).json({
            message: `Error rejecting Activity Proposal: ${error}`,
        });
    }
};
