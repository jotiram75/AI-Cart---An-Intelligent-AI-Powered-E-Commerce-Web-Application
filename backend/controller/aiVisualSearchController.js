import axios from "axios";
import Product from "../model/productModel.js";
import FormData from "form-data";
import fs from "fs";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

export const visualSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    console.log("[VisualSearch] Forwarding image to AI service...");

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/search`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (!aiResponse.data.success) {
      throw new Error(aiResponse.data.error || "AI service failed");
    }

    const searchResults = aiResponse.data.results;
    const productIds = searchResults.map((r) => r.product_id);

    // Fetch full product details for the returned IDs
    // We want to preserve the order returned by the AI service
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Sort products based on the order of productIds
    const orderedProducts = productIds.map(id => products.find(p => p._id.toString() === id)).filter(p => p);

    res.json({
      success: true,
      results: orderedProducts,
    });
  } catch (error) {
    console.error("[VisualSearch] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    // Clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
