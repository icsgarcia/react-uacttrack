import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRoute";
import activityProposalRouter from "./routes/activityProposalRoute";
import organizationRouter from "./routes/organizationRoute";
import venueRouter from "./routes/venueRoute";
import multer from "multer";
import uploadRouter from "./routes/uploadRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/apf", activityProposalRouter);
app.use("/organization", organizationRouter);
app.use("/venues", venueRouter);
app.use("/uploads", uploadRouter);
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res
                .status(400)
                .json({ message: "File too large. Max 10MB." });
        }
        return res
            .status(400)
            .json({ message: `Upload error: ${err.message}` });
    }
    if (err?.message?.includes("Invalid file type")) {
        return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
});

export default app;
