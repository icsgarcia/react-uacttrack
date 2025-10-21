import { Router } from "express";
import { getOrganizations } from "../controllers/organizationController";

const organizationRouter = Router();

organizationRouter.get("/", getOrganizations);

export default organizationRouter;
