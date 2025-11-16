import mongoose from "mongoose";
import config from "../config/config";
import seedOrganizations from "./seedOrganizations";
import seedVenues from "./seedVenues";
import seedAdmins from "./seedAdmins";

async function seed() {
    try {
        await mongoose.connect(config.mongodb_uri);
        console.log("Connected to MongoDB");

        await seedVenues();
        const organizations = await seedOrganizations();
        await seedAdmins(organizations);

        console.log("All seeds completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error(`Seeding failed: ${error}`);
        process.exit(1);
    }
}

seed();
