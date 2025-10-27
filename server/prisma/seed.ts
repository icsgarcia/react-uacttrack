import seedOrganizations from "./seeds/organizations";
import seedOrganizationsAdmin from "./seeds/organizationsAdmin";
import seedVenues from "./seeds/venues";

const seedAll = async () => {
    try {
        await seedOrganizations();
        await seedOrganizationsAdmin();
        await seedVenues();
    } catch (error) {
        console.error("Error seeding all data:", error);
    }
};

seedAll();
