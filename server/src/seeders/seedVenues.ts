import Venue from "../models/venueModel";

const venuesData = [
    {
        name: "UA Hotel",
        capacity: 250,
    },
    {
        name: "UA Conference Room",
        capacity: 100,
    },
    {
        name: "UA Cafe Maria",
        capacity: 70,
    },
    {
        name: "UA Facade",
        capacity: 20,
    },
    {
        name: "UA Chapel",
        capacity: 500,
    },
    {
        name: "Swimming Pool",
        capacity: 30,
    },
    {
        name: "Social Hall",
        capacity: 100,
    },
    {
        name: "Multi-Purpose Room",
        capacity: 300,
    },
    {
        name: "Gymnasium",
        capacity: 4000,
    },
    {
        name: "Auditorium",
        capacity: 540,
    },
    {
        name: "St. Thomas Aquinas Courtyard",
        capacity: 3000,
    },
    {
        name: "Covered Court 1",
        capacity: 800,
    },
    {
        name: "Covered Court 2",
        capacity: 800,
    },
    {
        name: "Ceninese Library",
        capacity: 50,
    },
    {
        name: "Classroom",
        capacity: 40,
    },
];

async function seedVenues() {
    console.log("Seeding venues...");

    await Venue.deleteMany();

    const venues = await Venue.insertMany(venuesData);

    console.log(`${venues.length} Venues created.`);
}

export default seedVenues;
