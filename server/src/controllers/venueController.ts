import { Request, Response } from "express";
import Venue from "../models/venueModel";

export const getVenues = async (req: Request, res: Response) => {
    try {
        const venues = await Venue.find();

        res.status(200).json(venues);
    } catch (error) {
        console.error("Error fetching venues:", error);
        res.status(500).json({ message: "Error fetching venues" });
    }
};
