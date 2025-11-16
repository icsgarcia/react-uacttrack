import { Router } from "express";
import {
    getApprovedActivities,
    getHolidays,
} from "../controllers/calendarController";
import { authenticateToken } from "../middlewares/authMiddleware";

const calendarRouter = Router();

calendarRouter.get("/", authenticateToken, getHolidays);
calendarRouter.get("/apf", authenticateToken, getApprovedActivities);

export default calendarRouter;
