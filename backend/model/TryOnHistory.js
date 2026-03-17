import mongoose from "mongoose";

const tryOnHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    userImageUrl: {
      type: String,
      required: true,
    },
    productImageUrl: {
      type: String,
      required: true,
    },
    generatedImageUrl: {
      type: String,
      required: true,
    },
    generationEngine: {
      type: String,
      default: "local-fastapi",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TryOnHistory = mongoose.model("TryOnHistory", tryOnHistorySchema);

export default TryOnHistory;
