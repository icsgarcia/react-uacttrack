import mongoose from "mongoose";

export interface Organization {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    logo: string;
}
