import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const organization = [
    {
        name: "Architecture Association of Assumption",
        logo: "organizations-logo/AAA.jpg",
        adminName: "AAA",
    },
    {
        name: "Business Administration College Council",
        logo: "organizations-logo/BACC.jpg",
        adminName: "BACC",
    },
    {
        name: "Bachelor in Human Services - Peer Helpers Society",
        logo: "organizations-logo/BHSPHS.jpg",
        adminName: "BHSPHS",
    },
    {
        name: "Citizen’s Drug Watch",
        logo: "organizations-logo/CDW.jpg",
        adminName: "CDW",
    },
    {
        name: "College of Hotel and Restaurant Management",
        logo: "organizations-logo/CHARMS.jpg",
        adminName: "CHARMS",
    },
    {
        name: "College Representatives of Engineering and Architecture Towards Excellence",
        logo: "organizations-logo/CREATE.jpg",
        adminName: "CREATE",
    },
    {
        name: "College Red Cross Youth Council",
        logo: "organizations-logo/CRYCYC.jpg",
        adminName: "CRCYC",
    },
    {
        name: "Institute of Computer Engineers of the Philippines",
        logo: "organizations-logo/ICPEP.jpg",
        adminName: "ICPEP",
    },
    {
        name: "Ingat Nang Asuncion",
        logo: "organizations-logo/INA.jpg",
        adminName: "INA",
    },
    {
        name: "Junior Philippine Institute of Accountants",
        logo: "organizations-logo/JPIA.jpg",
        adminName: "JPIA",
    },
    {
        name: "Junior Philippine Pharmacists Association",
        logo: "organizations-logo/JPPHA.jpg",
        adminName: "JPPHA",
    },
    {
        name: "League of Educators Advocating for Development",
        logo: "organizations-logo/LEAD.jpg",
        adminName: "LEAD",
    },
    {
        name: "League of Tourism Students of the Philippines",
        logo: "organizations-logo/LTSP.jpg",
        adminName: "LTSP",
    },
    {
        name: "Mass Communication Students Association",
        logo: "organizations-logo/MCSA.jpg",
        adminName: "MCSA",
    },
    {
        name: "Nursing Student Council",
        logo: "organizations-logo/NSC.jpg",
        adminName: "NSC",
    },
    {
        name: "Philippine Institute of Civil Engineers",
        logo: "organizations-logo/PICE.jpg",
        adminName: "PICE",
    },
    {
        name: "Philippine Institute of Industrial Engineers",
        logo: "organizations-logo/PIIE.png",
        adminName: "PIIE",
    },
    {
        name: "Psychology Society",
        logo: "organizations-logo/PSYCHSOC.jpg",
        adminName: "PSYCHSOC",
    },
    {
        name: "Student Society of Information Technology Education",
        logo: "organizations-logo/SSITE.jpg",
        adminName: "SSITE",
    },
    {
        name: "UA - Central Student Council",
        logo: "organizations-logo/UACSC.jpg",
        adminName: "UACSC",
    },
    {
        name: "UA - Student Assistants Organization",
        logo: "organizations-logo/UASAO.jpg",
        adminName: "UASAO",
    },
];

const seedOrganizations = async () => {
    try {
        for (const org of organization) {
            await prisma.organization.create({
                data: org,
            });
        }
        console.log("Seeding organizations completed successfully.");
    } catch (error) {
        console.error("Error seeding organizations:", error);
    } finally {
        await prisma.$disconnect();
    }
};

export default seedOrganizations;
