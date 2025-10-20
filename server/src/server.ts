import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute";
import activityProposalRouter from "./routes/activityProposalRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/apf", activityProposalRouter);

export default app;
