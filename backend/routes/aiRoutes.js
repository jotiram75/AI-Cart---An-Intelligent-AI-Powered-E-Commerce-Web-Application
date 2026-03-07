import express from "express";
import {
  tryOutfit,
  chatWithAI,
  getSuggestedQuestions,
  checkLimit,
} from "../controller/aiController.js";
import multer from "multer";
import superAdminAuth from "../middleware/superAdminAuth.js";
import {
  reindexVisualEmbeddings,
  visualSearchByImage,
} from "../controller/visualSearchController.js";
import { recommendSizeController } from "../controller/sizeRecommendationController.js";

const aiRouter = express.Router();
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
});
const maybeSuperAdminAuth =
  process.env.NODE_ENV === "production"
    ? superAdminAuth
    : (req, res, next) => next();

aiRouter.post("/try-on", tryOutfit);
aiRouter.post("/chat", chatWithAI);
aiRouter.get("/check-limit", checkLimit);
aiRouter.get("/suggest-questions", getSuggestedQuestions);

// AI Visual Search
aiRouter.post(
  "/visual-search",
  uploadMemory.single("image"),
  visualSearchByImage,
);
aiRouter.post(
  "/visual-search/reindex",
  maybeSuperAdminAuth,
  reindexVisualEmbeddings,
);

// AI Size Recommendation
aiRouter.post("/size-recommend", recommendSizeController);

export default aiRouter;
