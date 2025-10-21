import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute";
import activityProposalRouter from "./routes/activityProposalRoute";
import organizationRouter from "./routes/organizationRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/apf", activityProposalRouter);
app.use("/org", organizationRouter);

export default app;
