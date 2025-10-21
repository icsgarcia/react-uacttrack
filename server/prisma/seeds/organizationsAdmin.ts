import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const organizationsAdmin = [
    {
        firstName: "AAA",
        lastName: "AAA",
        role: "ADMIN",
        organizationId: 1,
        email: "AAA@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "BACC",
        lastName: "BACC",
        role: "ADMIN",
        organizationId: 2,
        email: "BACC@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "BHSPHS",
        lastName: "BHSPHS",
        role: "ADMIN",
        organizationId: 3,
        email: "BHSPHS@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "CDW",
        lastName: "CDW",
        role: "ADMIN",
        organizationId: 4,
        email: "CDW@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "CHARMS",
        lastName: "CHARMS",
        role: "ADMIN",
        organizationId: 5,
        email: "CHARMS@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "CREATE",
        lastName: "CREATE",
        role: "ADMIN",
        organizationId: 6,
        email: "CREATE@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "CRCYC",
        lastName: "CRCYC",
        role: "ADMIN",
        organizationId: 7,
        email: "CRCYC@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "ICPEP",
        lastName: "ICPEP",
        role: "ADMIN",
        organizationId: 8,
        email: "ICPEP@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "INA",
        lastName: "INA",
        role: "ADMIN",
        organizationId: 9,
        email: "INA@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "JPIA",
        lastName: "JPIA",
        role: "ADMIN",
        organizationId: 10,
        email: "JPIA@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "JPPHA",
        lastName: "JPPHA",
        role: "ADMIN",
        organizationId: 11,
        email: "JPPHA@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "LEAD",
        lastName: "LEAD",
        role: "ADMIN",
        organizationId: 12,
        email: "LEAD@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "LTSP",
        lastName: "LTSP",
        role: "ADMIN",
        organizationId: 13,
        email: "LTSP@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "MCSA",
        lastName: "MCSA",
        role: "ADMIN",
        organizationId: 14,
        email: "MCSA@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "NSC",
        lastName: "NSC",
        role: "ADMIN",
        organizationId: 15,
        email: "NSC@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "PICE",
        lastName: "PICE",
        role: "ADMIN",
        organizationId: 16,
        email: "PICE@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "PIIE",
        lastName: "PIIE",
        role: "ADMIN",
        organizationId: 17,
        email: "PIIE@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "PSYCHSOC",
        lastName: "PSYCHSOC",
        role: "ADMIN",
        organizationId: 18,
        email: "PSYCHSOC@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "SSITE",
        lastName: "SSITE",
        role: "ADMIN",
        organizationId: 19,
        email: "SSITE@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "UACSC",
        lastName: "UACSC",
        role: "ADMIN",
        organizationId: 20,
        email: "UACSC@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
    {
        firstName: "UASAO",
        lastName: "UASAO",
        role: "ADMIN",
        organizationId: 21,
        email: "UASAO@ua.edu.ph",
        password: bcrypt.hashSync("password", 10),
    },
];

const seedOrganizationsAdmin = async () => {
    try {
        for (const orgAdmin of organizationsAdmin) {
            await prisma.user.create({
                data: orgAdmin,
            });
        }
        console.log("Seeding organizations admin completed successfully.");
    } catch (error) {
        console.error("Error seeding organizations admin:", error);
    }
};

export default seedOrganizationsAdmin;
