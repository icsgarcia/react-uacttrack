import { Request, Response } from "express";
import Activity from "../models/activityModel";

interface Holiday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string | null;
    launchYear: string | null;
    types: string[];
}

export const getHolidays = async (req: Request, res: Response) => {
    try {
        const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/2025/PH`
        );
        const holidays: Holiday[] = await response.json();

        res.status(200).json(holidays);
    } catch (error) {
        console.error("Error fetching holidays:", error);
        res.status(500).json({ message: "Error fetching holidays" });
    }
};

export const getApprovedActivities = async (req: Request, res: Response) => {
    try {
        const approvedAPF = await Activity.find({ status: "APPROVED" })
            .select("title date startTime endTime venueId organizationId")
            .populate("venueId", "name")
            .populate("organizationId", "name");
        res.status(200).json(approvedAPF);
    } catch (error) {
        console.error("Error fetching approved activities:", error);
        res.status(500).json({ message: "Error fetching approved activities" });
    }
};
