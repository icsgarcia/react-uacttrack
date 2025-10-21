import { PrismaClient } from "../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getOrganizations = async (req: Request, res: Response) => {
    try {
        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        res.status(200).json(organizations);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Error fetching organizations" });
    }
};
