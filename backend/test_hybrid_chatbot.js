import mongoose from "mongoose";
import "dotenv/config";
import Product from "./model/productModel.js";
import Review from "./model/reviewModel.js";

// Mock classification logic (copy of the one in controller)
const classifyQuery = (message) => {
  const msg = message.toLowerCase();
  if (/\b(price|cost|how much|rate)\b/.test(msg)) return "price";
  if (/\b(size|sizes|dimension|fit|measurement)\b/.test(msg)) return "size";
  if (/\b(stock|available|availability|inventory|quantity)\b/.test(msg))
    return "stock";
  if (/\b(description|detail|details|material|fabric|about|what is)\b/.test(msg))
    return "description";
  if (/\b(review|reviews|rating|ratings|feedback|customer say)\b/.test(msg))
    return "reviews";
  return null;
};

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for testing hybrid logic");

    const testProduct = await Product.findOne();
    if (!testProduct) {
      console.error("No product found in DB for testing!");
      process.exit(1);
    }
    console.log(`Using product: ${testProduct.name} (${testProduct._id})`);

    const testQueries = [
      "What is the price of this?",
      "What sizes are available?",
      "Tell me more about it",
      "Is it in stock?",
      "Are there any reviews?",
      "Hello assistant, how are you?"
    ];

    for (const q of testQueries) {
      const classification = classifyQuery(q);
      console.log(`\nQuery: "${q}"`);
      console.log(`Classification: ${classification || "None (Fall back to LLM)"}`);

      if (classification) {
        let responseText = "";
        switch (classification) {
          case "price":
            responseText = `The ${testProduct.name} is priced at ₹${testProduct.price}.`;
            break;
          case "size":
            responseText = `The available sizes for ${testProduct.name} are: ${testProduct.sizes.join(", ")}.`;
            break;
          case "stock":
            responseText = `The ${testProduct.name} is currently in stock! We have it available in various sizes.`;
            break;
          case "description":
            responseText = `${testProduct.description}`;
            break;
          case "reviews":
            const reviews = await Review.find({ productId: testProduct._id }).limit(3);
            if (reviews.length > 0) {
              const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
              responseText = `Customers love this! It has an average rating of ${avgRating.toFixed(1)}/5 stars. Latest review: "${reviews[0].text}"`;
            } else {
              responseText = `We don't have any reviews for ${testProduct.name} yet, but it's a popular choice!`;
            }
            break;
        }
        console.log(`DB Response: ${responseText}`);
      }
    }

    await mongoose.disconnect();
    console.log("\nTests completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};

runTest();
