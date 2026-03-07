import mongoose from "mongoose";
import Product from "../model/productModel.js";
import Review from "../model/reviewModel.js";
import { analyzeReviews, buildAggregateInsights } from "../services/reviewAnalysisService.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id || ""));

export const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    const product = await Product.findById(productId).select("_id name");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const rating = Number(req.body?.rating);
    const title = String(req.body?.title || "").trim();
    const text = String(req.body?.text || "").trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "rating must be 1-5" });
    }
    if (!text) {
      return res.status(400).json({ success: false, message: "text is required" });
    }
    if (text.length > 1800) {
      return res.status(400).json({ success: false, message: "text must be <= 1800 characters" });
    }

    const existing = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .limit(60)
      .select("text")
      .lean();
    const existingTexts = existing.map((r) => r.text).filter(Boolean);

    const analysis = await analyzeReviews(
      [{ rating, title, text }],
      {
        includeSummary: false,
        existingReviewTextsForDupCheck: existingTexts,
      },
    );

    const a = analysis.reviews[0];
    const doc = await Review.create({
      productId,
      userId: req.userId || null,
      rating,
      title,
      text: a.text,
      sentiment: a.overallSentiment,
      clauses: a.clauses,
      pros: a.pros,
      cons: a.cons,
      fake: a.fake,
    });

    return res.status(201).json({ success: true, review: doc });
  } catch (error) {
    console.log("AddProductReview error");
    return res.status(500).json({
      success: false,
      message: `AddProductReview error ${error?.message || error}`,
    });
  }
};

export const listProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    const limit = Math.min(50, Math.max(1, Number(req.query?.limit) || 20));
    const includeSummary = String(req.query?.includeSummary || "").toLowerCase() === "true";

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "name")
      .lean();

    const aggregate = await buildAggregateInsights({
      reviews: reviews.map((r, idx) => ({
        index: idx,
        text: r.text,
        overallSentiment: r.sentiment,
        pros: r.pros || [],
        cons: r.cons || [],
        fake: r.fake || { score: 0 },
      })),
      allTexts: reviews.map((r) => r.text),
      allPositiveClauses: [],
      allNegativeClauses: [],
      includeSummary,
    });

    return res.status(200).json({ success: true, reviews, insights: aggregate });
  } catch (error) {
    console.log("ListProductReviews error");
    return res.status(500).json({
      success: false,
      message: `ListProductReviews error ${error?.message || error}`,
    });
  }
};

