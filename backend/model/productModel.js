import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    image4: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    bestseller: {
      type: Boolean,
    },
    vendorId: {
      type: String,
      required: true,
    },

    // AI Visual Search (image embeddings) - normalized vector for cosine similarity
    visualEmbedding: {
      type: [Number],
      default: undefined,
    },
    visualEmbeddingDim: {
      type: Number,
      default: undefined,
    },
    visualEmbeddingModel: {
      type: String,
      default: undefined,
    },
    visualEmbeddingUpdatedAt: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
