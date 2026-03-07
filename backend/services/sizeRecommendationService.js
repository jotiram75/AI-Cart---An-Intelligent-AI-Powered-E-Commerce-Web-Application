const BODY_TYPES = ["slim", "average", "athletic", "curvy"];
const FIT_PREFERENCES = ["slim", "regular", "loose"];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const normalizeBodyType = (bodyType = "") => {
  const idx = BODY_TYPES.indexOf(
    String(bodyType || "")
      .toLowerCase()
      .trim(),
  );
  return idx >= 0 ? idx : BODY_TYPES.indexOf("average");
};

const normalizeFitPreference = (fit = "") => {
  const idx = FIT_PREFERENCES.indexOf(
    String(fit || "")
      .toLowerCase()
      .trim(),
  );
  return idx >= 0 ? FIT_PREFERENCES[idx] : "regular";
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

const euclidean = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
};

const orderOfAlphaSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const shiftAlphaSize = (size, delta) => {
  const idx = orderOfAlphaSizes.indexOf(size);
  if (idx < 0) return size;
  return orderOfAlphaSizes[clamp(idx + delta, 0, orderOfAlphaSizes.length - 1)];
};

const chooseNearestAvailableAlphaSize = (predicted, availableSizes = []) => {
  if (!Array.isArray(availableSizes) || availableSizes.length === 0)
    return predicted;
  const normalized = availableSizes.map((s) => String(s).toUpperCase().trim());
  if (normalized.includes(predicted)) return predicted;

  const predIdx = orderOfAlphaSizes.indexOf(predicted);
  if (predIdx < 0) return predicted;

  let best = normalized[0];
  let bestDist = Infinity;
  for (const s of normalized) {
    const idx = orderOfAlphaSizes.indexOf(s);
    if (idx < 0) continue;
    const dist = Math.abs(idx - predIdx);
    if (dist < bestDist) {
      bestDist = dist;
      best = s;
    }
  }
  return best || predicted;
};

const dataset = {
  women: {
    topwear: [
      { x: [150, 45, "slim"], y: "XS" },
      { x: [155, 50, "slim"], y: "S" },
      { x: [160, 55, "average"], y: "S" },
      { x: [165, 60, "average"], y: "M" },
      { x: [170, 65, "athletic"], y: "M" },
      { x: [165, 70, "curvy"], y: "L" },
      { x: [170, 75, "curvy"], y: "XL" },
      { x: [175, 80, "average"], y: "XL" },
      { x: [160, 62, "curvy"], y: "M" },
      { x: [158, 58, "athletic"], y: "S" },
      { x: [168, 68, "average"], y: "L" },
    ],
    bottomwear: [
      { x: [150, 45, "slim"], y: "XS" },
      { x: [155, 50, "slim"], y: "S" },
      { x: [160, 55, "average"], y: "S" },
      { x: [165, 60, "average"], y: "M" },
      { x: [170, 65, "athletic"], y: "M" },
      { x: [165, 70, "curvy"], y: "L" },
      { x: [170, 75, "curvy"], y: "XL" },
      { x: [175, 82, "curvy"], y: "XXL" },
      { x: [168, 72, "average"], y: "L" },
      { x: [158, 58, "athletic"], y: "S" },
    ],
  },
  men: {
    topwear: [
      { x: [160, 55, "slim"], y: "S" },
      { x: [165, 60, "slim"], y: "S" },
      { x: [170, 68, "average"], y: "M" },
      { x: [175, 75, "average"], y: "L" },
      { x: [180, 82, "athletic"], y: "L" },
      { x: [178, 88, "average"], y: "XL" },
      { x: [185, 95, "average"], y: "XXL" },
      { x: [172, 70, "athletic"], y: "M" },
      { x: [168, 72, "average"], y: "M" },
      { x: [176, 90, "curvy"], y: "XL" },
    ],
    bottomwear: [
      { x: [160, 55, "slim"], y: "S" },
      { x: [165, 62, "slim"], y: "S" },
      { x: [170, 70, "average"], y: "M" },
      { x: [175, 78, "average"], y: "L" },
      { x: [180, 85, "athletic"], y: "L" },
      { x: [178, 92, "average"], y: "XL" },
      { x: [185, 100, "average"], y: "XXL" },
      { x: [172, 74, "athletic"], y: "M" },
      { x: [176, 96, "curvy"], y: "XL" },
    ],
  },
  kids: {
    topwear: [
      { x: [100, 16, "slim"], y: "S" },
      { x: [110, 18, "average"], y: "S" },
      { x: [120, 22, "average"], y: "M" },
      { x: [130, 26, "average"], y: "L" },
      { x: [140, 32, "curvy"], y: "XL" },
    ],
    bottomwear: [
      { x: [100, 16, "slim"], y: "S" },
      { x: [110, 19, "average"], y: "S" },
      { x: [120, 23, "average"], y: "M" },
      { x: [130, 27, "average"], y: "L" },
      { x: [140, 33, "curvy"], y: "XL" },
    ],
  },
};

const buildFeature = ({ heightCm, weightKg, bodyType }) => {
  const h = clamp(heightCm, 80, 210);
  const w = clamp(weightKg, 10, 160);
  const bt = normalizeBodyType(bodyType);
  // normalize to comparable ranges
  return [h / 200, w / 150, bt / 3];
};

const knnPredict = ({ points, query, k = 5 }) => {
  const scored = points
    .map((p) => ({ y: p.y, d: euclidean(query, p.f) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, clamp(k, 1, 15));

  const votes = new Map();
  let weightSum = 0;
  for (const n of scored) {
    const w = 1 / (n.d + 1e-6);
    weightSum += w;
    votes.set(n.y, (votes.get(n.y) || 0) + w);
  }

  const ranked = Array.from(votes.entries())
    .map(([size, weight]) => ({
      size,
      weight,
      confidence: weight / (weightSum || 1),
    }))
    .sort((a, b) => b.weight - a.weight);

  return {
    predicted: ranked[0]?.size || null,
    ranked,
    neighbors: scored.length,
  };
};

export const recommendSize = ({
  gender,
  garmentType,
  heightCm,
  weightKg,
  bodyType,
  fitPreference,
  availableSizes,
  k,
}) => {
  const g = String(gender || "women")
    .toLowerCase()
    .trim();
  const gt = String(garmentType || "topwear")
    .toLowerCase()
    .trim();

  const h = toNumber(heightCm);
  const w = toNumber(weightKg);
  if (!Number.isFinite(h) || !Number.isFinite(w)) {
    throw new Error("heightCm and weightKg must be numbers");
  }

  if (!dataset[g] || !dataset[g][gt]) {
    throw new Error("Unsupported gender or garmentType");
  }

  const points = dataset[g][gt].map((row) => ({
    f: buildFeature({
      heightCm: row.x[0],
      weightKg: row.x[1],
      bodyType: row.x[2],
    }),
    y: row.y,
  }));

  const query = buildFeature({ heightCm: h, weightKg: w, bodyType });
  const fit = normalizeFitPreference(fitPreference);

  const { predicted, ranked, neighbors } = knnPredict({
    points,
    query,
    k: Number.isFinite(Number(k)) ? Number(k) : 5,
  });

  if (!predicted) {
    throw new Error("Unable to predict size");
  }

  const delta = fit === "slim" ? -1 : fit === "loose" ? 1 : 0;
  const adjusted = shiftAlphaSize(predicted, delta);
  const finalSize = chooseNearestAvailableAlphaSize(adjusted, availableSizes);

  return {
    model: "knn",
    modelVersion: "knn-v1",
    gender: g,
    garmentType: gt,
    input: {
      heightCm: h,
      weightKg: w,
      bodyType: String(bodyType || "average"),
      fitPreference: fit,
    },
    recommendation: {
      size: finalSize,
      baseSize: predicted,
      adjustedSize: adjusted,
      confidence: ranked[0]?.confidence ?? null,
      alternatives: ranked
        .slice(0, 3)
        .map((r) => ({ size: r.size, confidence: r.confidence })),
      neighbors,
    },
    notes: [
      "This is an AI-assisted estimate based on height/weight/body type; brand fits may vary.",
      "If between sizes, choose the larger size for comfort or the smaller size for a tighter fit.",
    ],
  };
};
