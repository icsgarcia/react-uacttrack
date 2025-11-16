import mongoose from "mongoose";
import { User } from "./User";
import { Venue } from "./Venue";
import { Organization } from "./Organization";

export interface Activity {
    title: string;
    purpose: string;
    participants: string;
    attendees: number;
    requirements: string;
    date: Date;
    startTime: string;
    endTime: string;
    headStatus: string;
    osaStatus: string;
    vpaStatus: string;
    vpaaStatus: string;
    status: string;
    cashForm: string;
    foodForm: string;
    supplyForm: string;
    reproductionForm: string;
    otherForm: string;
    createdAt: Date;
    updatedAt: Date;
    userId: mongoose.Schema.Types.ObjectId | User;
    organizationId: mongoose.Schema.Types.ObjectId | Organization;
    venueId: mongoose.Schema.Types.ObjectId | Venue;
}
