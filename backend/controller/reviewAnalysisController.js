import { analyzeReviews } from "../services/reviewAnalysisService.js";

export const analyzeReviewPayload = async (req, res) => {
  try {
    const { reviews, includeSummary } = req.body || {};

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({
        success: false,
        message: "reviews must be a non-empty array",
      });
    }

    if (reviews.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Maximum 50 reviews per request",
      });
    }

    const sanitized = reviews.map((r) => (typeof r === "string" ? { text: r } : r));
    for (const r of sanitized) {
      const text = String(r?.text || "").trim();
      if (!text) {
        return res.status(400).json({
          success: false,
          message: "Each review must include text",
        });
      }
      if (text.length > 1800) {
        return res.status(400).json({
          success: false,
          message: "Each review text must be <= 1800 characters",
        });
      }
    }

    const analysis = await analyzeReviews(sanitized, {
      includeSummary: Boolean(includeSummary),
    });

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.log("AnalyzeReviewPayload error");
    return res.status(500).json({
      success: false,
      message: `AnalyzeReviewPayload error ${error?.message || error}`,
    });
  }
};

