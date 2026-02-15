import express from "express";
import { tryOutfit } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/try-on", tryOutfit);

export default aiRouter;
