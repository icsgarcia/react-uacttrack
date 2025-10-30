import { Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../services/s3Service";
import config from "../config/config";

const prisma = new PrismaClient();

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
        if (!req.user?.userId) {
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
            organizationId,
        } = req.body;

        // Validate required fields
        if (!date || !startTime || !endTime || !venueId || !title) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const proposal = await prisma.activityProposal.create({
            data: {
                cashForm: cashForm || null,
                foodForm: foodForm || null,
                supplyForm: supplyForm || null,
                reproductionForm: reproductionForm || null,
                otherForm: otherForm || null,
                attendees: parseInt(attendees),
                date: new Date(date),
                startTime: String(startTime),
                endTime: String(endTime),
                venueId: parseInt(venueId),
                title,
                participants,
                purpose,
                requirements,
                userId: req.user.userId,
                organizationId: parseInt(organizationId),
            },
        });

        res.status(201).json({
            message: "Activity Proposal created successfully",
            proposal,
        });
    } catch (error) {
        console.error("Error creating Activity Proposal:", error);
        res.status(500).json({
            message: "Error creating Activity Proposal",
        });
    }
};

export const getPendingActivityProposals = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { organizationId: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const activityProposals = await prisma.activityProposal.findMany({
            where: {
                organizationId: user.organizationId,
                status: "PENDING",
            },
            select: {
                id: true,
                title: true,
                updatedAt: true,
            },
        });
        res.status(200).json(activityProposals);
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
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { organizationId: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const approvedAPF = await prisma.activityProposal.findMany({
            where: {
                organizationId: user.organizationId,
                status: "APPROVED",
            },
            select: {
                id: true,
                title: true,
                updatedAt: true,
            },
        });
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
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { organizationId: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const rejectedAPF = await prisma.activityProposal.findMany({
            where: {
                organizationId: user.organizationId,
                status: "REJECTED",
            },
            select: {
                id: true,
                title: true,
                updatedAt: true,
            },
        });
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
        const activityProposal = await prisma.activityProposal.findUnique({
            where: { id: parseInt(id!) },
        });

        if (!activityProposal) {
            return res
                .status(404)
                .json({ message: "Activity Proposal not found" });
        }

        const apfCreator = await prisma.user.findUnique({
            where: { id: activityProposal.userId },
            select: { firstName: true, lastName: true },
        });

        const apfOrganization = await prisma.organization.findUnique({
            where: { id: activityProposal.organizationId },
            select: { name: true, adminName: true },
        });

        const apfVenue = await prisma.venue.findUnique({
            where: { id: activityProposal.venueId },
            select: { name: true },
        });

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

        const apf = {
            ...activityProposal,
            creatorFirstName: apfCreator!.firstName,
            creatorLastName: apfCreator!.lastName,
            organization: apfOrganization!.name,
            organizationAdmin: apfOrganization!.adminName,
            venue: apfVenue!.name,
            cashFormFile,
            foodFormFile,
            supplyFormFile,
            reproductionFormFile,
            otherFormFile,
        };

        res.status(200).json(apf);
        // console.log("Fetched Activity Proposal:", apf);
    } catch (error) {
        console.error("Error fetching Activity Proposal:", error);
        res.status(500).json({
            message: "Error fetching Activity Proposal",
        });
    }
};
