import mongoose from "mongoose";
import type { Organization } from "../types/Organization";

const organizationSchema = new mongoose.Schema<Organization>({
    name: String,
    logo: String,
});

const Organization = mongoose.model<Organization>(
    "Organization",
    organizationSchema
);

export default Organization;
