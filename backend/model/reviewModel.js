import mongoose from "mongoose";

const reviewClauseSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    label: { type: String, required: true },
    score: { type: Number, required: true },
    model: { type: String, required: true },
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, default: "" },
    text: { type: String, required: true },

    sentiment: {
      label: { type: String, default: "NEUTRAL" },
      score: { type: Number, default: 0 },
      model: { type: String, default: "unknown" },
    },
    clauses: { type: [reviewClauseSchema], default: [] },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
    fake: {
      score: { type: Number, default: 0 },
      reasons: { type: [String], default: [] },
      duplicateOf: { type: String, default: null },
      similarity: { type: Number, default: null },
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;

