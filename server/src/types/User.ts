import mongoose from "mongoose";
import type { Organization } from "../types/Organization";

export interface User {
    _id: mongoose.Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: mongoose.Schema.Types.ObjectId | Organization;
}
