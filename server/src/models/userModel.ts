import mongoose from "mongoose";
import type { User } from "../types/User";

const userSchema = new mongoose.Schema<User>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
        type: String,
        enum: ["STUDENT", "HEAD", "OSA", "VPA", "VPAA"],
        default: "STUDENT",
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
});

const User = mongoose.model<User>("User", userSchema);

export default User;
