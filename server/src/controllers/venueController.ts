import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getVenues = async (req: Request, res: Response) => {
    try {
        const venues = await prisma.venue.findMany();

        res.status(200).json(venues);
    } catch (error) {
        console.error("Error fetching venues:", error);
        res.status(500).json({ message: "Error fetching venues" });
    }
};
