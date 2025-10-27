import { Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

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

export const getActivityProposals = async (req: AuthRequest, res: Response) => {
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
