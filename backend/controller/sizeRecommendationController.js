import { recommendSize } from "../services/sizeRecommendationService.js";

export const recommendSizeController = async (req, res) => {
  try {
    const {
      gender,
      garmentType,
      heightCm,
      weightKg,
      bodyType,
      fitPreference,
      availableSizes,
      k,
    } = req.body || {};

    const result = recommendSize({
      gender,
      garmentType,
      heightCm,
      weightKg,
      bodyType,
      fitPreference,
      availableSizes,
      k,
    });

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    const message = error.message || "Size recommendation failed";
    const status = /must be numbers|Unsupported|Unable to predict/i.test(message)
      ? 400
      : 500;
    return res.status(status).json({ success: false, message });
  }
};

