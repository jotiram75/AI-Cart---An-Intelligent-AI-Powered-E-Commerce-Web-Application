import mongoose from "mongoose";

const chatQuerySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Normalize for better hit rate
    },
    response: {
      type: String,
      required: true,
    },
    contextType: {
      type: String,
      enum: ["global", "product"],
      default: "global",
    },
    productName: {
      type: String, // Only required if contextType is 'product'
      default: null,
      trim: true,
      lowercase: true,
    },
    hits: {
      type: Number,
      default: 1,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookups
chatQuerySchema.index({ query: 1, contextType: 1, productName: 1 });

const ChatQuery = mongoose.model("ChatQuery", chatQuerySchema);

export default ChatQuery;
