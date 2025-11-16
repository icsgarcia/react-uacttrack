import app from "./server";
import connectDB from "./config/db";

app.listen(3000, () => {
    connectDB().catch();
    console.log(`Server is running on port 3000`);
});
