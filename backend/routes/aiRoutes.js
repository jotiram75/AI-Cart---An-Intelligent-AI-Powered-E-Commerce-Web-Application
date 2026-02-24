import express from "express";
import { tryOutfit, chatWithAI, getSuggestedQuestions, checkLimit } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/try-on", tryOutfit);
aiRouter.post("/chat", chatWithAI);
aiRouter.get("/check-limit", checkLimit);
aiRouter.get("/suggest-questions", getSuggestedQuestions);

export default aiRouter;
