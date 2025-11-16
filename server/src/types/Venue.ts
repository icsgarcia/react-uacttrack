import mongoose from "mongoose";

export interface Venue {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    capacity: number;
}
