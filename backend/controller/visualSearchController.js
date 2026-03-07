import Product from "../model/productModel.js";
import {
  computeProductEmbeddingFromText,
  computeQueryEmbeddingFromImageBuffer,
  cosineSimilarityNormalized,
  getVisualSearchModelId,
} from "../services/visualEmbeddingService.js";

export const visualSearchByImage = async (req, res) => {
  try {
    const modelId = (
      req.body?.modelId ||
      req.query?.modelId ||
      getVisualSearchModelId()
    ).trim();
    const topK = Math.max(
      1,
      Math.min(50, Number(req.body?.topK || req.query?.topK || 12)),
    );

    if (!req.file?.buffer?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Missing image file (field: image)" });
    }

    const { embedding: queryEmbedding, dim, caption } =
      await computeQueryEmbeddingFromImageBuffer(req.file.buffer, {
        textModelId: modelId,
        mimeType: req.file.mimetype || "image/jpeg",
      });

    const candidates = await Product.find({
      visualEmbeddingModel: modelId,
      visualEmbedding: { $exists: true, $ne: [] },
    }).select("name price image1 category subCategory visualEmbedding");

    if (!candidates.length) {
      return res.status(409).json({
        success: false,
        message:
          "No products are indexed for visual search yet. Add products (with embeddings) or run the reindex endpoint.",
      });
    }

    const scored = candidates
      .map((p) => {
        const embedding = p.visualEmbedding || [];
        const score = embedding.length
          ? cosineSimilarityNormalized(queryEmbedding, embedding)
          : -1;
        return {
          product: {
            _id: p._id,
            name: p.name,
            price: p.price,
            image1: p.image1,
            category: p.category,
            subCategory: p.subCategory,
          },
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return res.status(200).json({
      success: true,
      modelId,
      queryDim: dim,
      caption,
      count: scored.length,
      results: scored,
    });
  } catch (error) {
    console.error(
      "[VISUAL-SEARCH] Error:",
      error?.response?.data || error.message,
    );
    const message = error.message || "Visual search failed";
    const status = /Missing (HUGGINGFACE_API_KEY|GEMINI_API_KEY)/i.test(message)
      ? 503
      : 500;
    return res.status(status).json({ success: false, message });
  }
};

export const reindexVisualEmbeddings = async (req, res) => {
  try {
    const modelId = (req.body?.modelId || getVisualSearchModelId()).trim();
    const limit = Math.max(1, Math.min(500, Number(req.body?.limit || 50)));
    const onlyMissing = req.body?.onlyMissing !== false;

    const query = onlyMissing
      ? {
          $or: [
            { visualEmbedding: { $exists: false } },
            { visualEmbedding: { $size: 0 } },
            { visualEmbeddingModel: { $ne: modelId } },
          ],
        }
      : {};

    const products = await Product.find(query)
      .limit(limit)
      .select("_id name description category subCategory");

    let updated = 0;
    const failures = [];

    for (const p of products) {
      try {
        const productText = `${p.name}. Category: ${p.category} / ${p.subCategory}. ${p.description}`;
        const { embedding, dim } = await computeProductEmbeddingFromText(productText, modelId);
        await Product.updateOne(
          { _id: p._id },
          {
            $set: {
              visualEmbedding: embedding,
              visualEmbeddingDim: dim,
              visualEmbeddingModel: modelId,
              visualEmbeddingUpdatedAt: new Date(),
            },
          },
        );
        updated += 1;
      } catch (e) {
        failures.push({ productId: String(p._id), message: e.message });
      }
    }

    return res.status(200).json({
      success: true,
      modelId,
      requested: products.length,
      updated,
      failed: failures.length,
      failures,
    });
  } catch (error) {
    console.error(
      "[VISUAL-REINDEX] Error:",
      error?.response?.data || error.message,
    );
    const message = error.message || "Reindex failed";
    const status = /Missing (HUGGINGFACE_API_KEY|GEMINI_API_KEY)/i.test(message)
      ? 503
      : 500;
    return res.status(status).json({ success: false, message });
  }
};
