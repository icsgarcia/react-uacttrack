import { Request, Response } from "express";
import Organization from "../models/organizationModel";

export const getOrganizations = async (req: Request, res: Response) => {
    try {
        const organizations = await Organization.find().select("name");

        res.status(200).json(organizations);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Error fetching organizations" });
    }
};
