import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    name: String,
    capacity: Number,
});

const Venue = mongoose.model("Venue", venueSchema);

export default Venue;
