import { Router } from "express";
import { getVenues } from "../controllers/venueController";
import { authenticateToken } from "../middlewares/authMiddleware";

const venueRouter = Router();

venueRouter.get("/", getVenues);

export default venueRouter;
