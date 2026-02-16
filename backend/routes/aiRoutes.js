import express from "express";
import { tryOutfit, chatWithAI, getSuggestedQuestions } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/try-on", tryOutfit);
aiRouter.post("/chat", chatWithAI);
aiRouter.get("/suggest-questions", getSuggestedQuestions);

export default aiRouter;
