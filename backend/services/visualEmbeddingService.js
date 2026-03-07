export const getVisualSearchModelId = () =>
  process.env.VISUAL_SEARCH_MODEL_ID || "local-hash-v1";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_CAPTION_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
];

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const fnv1a32 = (str) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const buildHashedEmbedding = (text, dim = 512) => {
  const tokens = tokenize(text);
  const vector = new Array(dim).fill(0);

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];
    const h = fnv1a32(t);
    const idx = h % dim;
    const sign = (h & 1) === 0 ? 1 : -1;
    vector[idx] += sign;

    // add a lightweight bigram feature for a bit more specificity
    if (i + 1 < tokens.length) {
      const bi = `${t}_${tokens[i + 1]}`;
      const hb = fnv1a32(bi);
      const idxb = hb % dim;
      const signb = (hb & 1) === 0 ? 1 : -1;
      vector[idxb] += 0.5 * signb;
    }
  }

  const { normalized, norm } = l2Normalize(vector);
  return { embedding: normalized, dim, norm };
};

const getGeminiClient = async () => {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY for visual search image captioning");
  }
  const mod = await import("@google/generative-ai");
  return new mod.GoogleGenerativeAI(GEMINI_API_KEY);
};

const captionWithGemini = async (imageBuffer, mimeType = "image/jpeg") => {
  const genAI = await getGeminiClient();
  const base64 = Buffer.from(imageBuffer).toString("base64");
  const prompt =
    "Describe the product in this image for shopping search. " +
    "Return a short caption with product type, color, material, pattern, and style. " +
    "Return only the caption text.";

  let lastError = null;
  for (const modelName of GEMINI_CAPTION_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType, data: base64 } },
      ]);
      const caption = result?.response?.text?.() || "";
      const cleaned = String(caption).trim();
      if (cleaned) return cleaned;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error("Gemini captioning failed");
};

export const l2Normalize = (vector) => {
  let sumSq = 0;
  for (let i = 0; i < vector.length; i += 1) sumSq += vector[i] * vector[i];
  const norm = Math.sqrt(sumSq) || 1;
  const normalized = new Array(vector.length);
  for (let i = 0; i < vector.length; i += 1) normalized[i] = vector[i] / norm;
  return { normalized, norm };
};

export const cosineSimilarityNormalized = (a, b) => {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < len; i += 1) dot += a[i] * b[i];
  return dot;
};

export const computeQueryEmbeddingFromImageBuffer = async (
  imageBuffer,
  { textModelId = getVisualSearchModelId(), mimeType = "image/jpeg" } = {},
) => {
  if (textModelId !== "local-hash-v1") {
    throw new Error(
      `Unsupported VISUAL_SEARCH_MODEL_ID "${textModelId}". Supported: local-hash-v1`,
    );
  }

  const caption = await captionWithGemini(imageBuffer, mimeType);
  if (!caption) {
    throw new Error("Failed to generate caption from the uploaded image");
  }
  const { embedding, dim, norm } = buildHashedEmbedding(caption, 512);
  return { embedding, dim, norm, caption, textModelId };
};

export const computeProductEmbeddingFromText = async (
  productText,
  textModelId = getVisualSearchModelId(),
) => {
  if (textModelId !== "local-hash-v1") {
    throw new Error(
      `Unsupported VISUAL_SEARCH_MODEL_ID "${textModelId}". Supported: local-hash-v1`,
    );
  }
  const { embedding, dim, norm } = buildHashedEmbedding(productText, 512);
  return { embedding, dim, norm, textModelId };
};
