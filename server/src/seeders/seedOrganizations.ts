import Organization from "../models/organizationModel";

const organizationsData = [
    {
        name: "Architecture Association of Assumption",
        logo: "organizations-logo/AAA.jpg",
    },
    {
        name: "Business Administration College Council",
        logo: "organizations-logo/BACC.jpg",
    },
    {
        name: "Bachelor in Human Services - Peer Helpers Society",
        logo: "organizations-logo/BHSPHS.jpg",
    },
    {
        name: "Citizen’s Drug Watch",
        logo: "organizations-logo/CDW.jpg",
    },
    {
        name: "College of Hotel and Restaurant Management",
        logo: "organizations-logo/CHARMS.jpg",
    },
    {
        name: "College Representatives of Engineering and Architecture Towards Excellence",
        logo: "organizations-logo/CREATE.jpg",
    },
    {
        name: "College Red Cross Youth Council",
        logo: "organizations-logo/CRYCYC.jpg",
    },
    {
        name: "Institute of Computer Engineers of the Philippines",
        logo: "organizations-logo/ICPEP.jpg",
    },
    {
        name: "Ingat Nang Asuncion",
        logo: "organizations-logo/INA.jpg",
    },
    {
        name: "Junior Philippine Institute of Accountants",
        logo: "organizations-logo/JPIA.jpg",
    },
    {
        name: "Junior Philippine Pharmacists Association",
        logo: "organizations-logo/JPPHA.jpg",
    },
    {
        name: "League of Educators Advocating for Development",
        logo: "organizations-logo/LEAD.jpg",
    },
    {
        name: "League of Tourism Students of the Philippines",
        logo: "organizations-logo/LTSP.jpg",
    },
    {
        name: "Mass Communication Students Association",
        logo: "organizations-logo/MCSA.jpg",
    },
    {
        name: "Nursing Student Council",
        logo: "organizations-logo/NSC.jpg",
    },
    {
        name: "Philippine Institute of Civil Engineers",
        logo: "organizations-logo/PICE.jpg",
    },
    {
        name: "Philippine Institute of Industrial Engineers",
        logo: "organizations-logo/PIIE.png",
    },
    {
        name: "Psychology Society",
        logo: "organizations-logo/PSYCHSOC.jpg",
    },
    {
        name: "Student Society of Information Technology Education",
        logo: "organizations-logo/SSITE.jpg",
    },
    {
        name: "UA - Central Student Council",
        logo: "organizations-logo/UACSC.jpg",
    },
    {
        name: "UA - Student Assistants Organization",
        logo: "organizations-logo/UASAO.jpg",
    },
    {
        name: "University of the Assumption Offices",
        logo: "organizations-logo/UA.jpg",
    },
];

async function seedOrganizations() {
    console.log("Seeding organizations...");

    await Organization.deleteMany();

    const organizations = await Organization.insertMany(organizationsData);

    console.log(`${organizations.length} Organizations created.`);

    return organizations;
}

export default seedOrganizations;
