import express from "express";
import { tryOutfit, chatWithAI } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/try-on", tryOutfit);
aiRouter.post("/chat", chatWithAI);

export default aiRouter;
