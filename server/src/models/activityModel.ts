import mongoose from "mongoose";
import type { Activity } from "../types/Activity";

const activitySchema = new mongoose.Schema<Activity>({
    title: { type: String, required: true },
    purpose: { type: String, required: true },
    participants: { type: String, required: true },
    attendees: { type: Number, required: true },
    requirements: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    headStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    osaStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    vpaStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    vpaaStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    cashForm: { type: String },
    foodForm: { type: String },
    supplyForm: { type: String },
    reproductionForm: { type: String },
    otherForm: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true,
    },
});

const Activity = mongoose.model<Activity>("Activity", activitySchema);

export default Activity;
