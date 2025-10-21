import seedOrganizations from "./seeds/organizations";
import seedOrganizationsAdmin from "./seeds/organizationsAdmin";

const seedAll = async () => {
    try {
        await seedOrganizations();
        await seedOrganizationsAdmin();
    } catch (error) {
        console.error("Error seeding all data:", error);
    }
};

seedAll();
