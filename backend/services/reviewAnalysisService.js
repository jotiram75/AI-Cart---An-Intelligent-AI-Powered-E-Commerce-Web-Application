import axios from "axios";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export const getReviewSentimentModelId = () =>
  process.env.REVIEW_SENTIMENT_MODEL_ID ||
  "distilbert-base-uncased-finetuned-sst-2-english";

export const getReviewSummaryModelId = () =>
  process.env.REVIEW_SUMMARY_MODEL_ID || "sshleifer/distilbart-cnn-12-6";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const STOPWORDS = new Set(
  [
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "from",
    "has",
    "have",
    "had",
    "he",
    "her",
    "hers",
    "him",
    "his",
    "i",
    "in",
    "into",
    "is",
    "it",
    "its",
    "me",
    "my",
    "not",
    "of",
    "on",
    "or",
    "our",
    "ours",
    "she",
    "so",
    "than",
    "that",
    "the",
    "their",
    "them",
    "then",
    "there",
    "these",
    "they",
    "this",
    "to",
    "too",
    "up",
    "us",
    "very",
    "was",
    "we",
    "were",
    "with",
    "you",
    "your",
    "yours",
  ].map((s) => s.toLowerCase()),
);

const POS_WORDS = new Set([
  "amazing",
  "awesome",
  "beautiful",
  "best",
  "comfortable",
  "excellent",
  "fantastic",
  "good",
  "great",
  "love",
  "loved",
  "perfect",
  "recommend",
  "solid",
  "superb",
  "value",
  "worth",
]);

const NEG_WORDS = new Set([
  "bad",
  "broken",
  "cheap",
  "disappointed",
  "disappointing",
  "hate",
  "poor",
  "terrible",
  "waste",
  "worst",
  "refund",
  "return",
  "damaged",
  "defective",
  "slow",
  "late",
]);

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const normalizeWhitespace = (text) => String(text || "").replace(/\s+/g, " ").trim();

const splitIntoClauses = (text) => {
  const t = normalizeWhitespace(text);
  if (!t) return [];

  // split on sentence boundaries first, then on contrastive conjunctions
  const sentences = t
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const clauses = [];
  for (const s of sentences) {
    const parts = s
      .split(/\s+(but|however|though|although|yet)\s+/i)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of parts) {
      if (/^(but|however|though|although|yet)$/i.test(p)) continue;
      clauses.push(p);
    }
  }
  return clauses.length ? clauses : [t];
};

const toHfAuthHeaders = () =>
  HUGGINGFACE_API_KEY ? { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` } : {};

const hfPostWithRetry = async (url, body, { timeoutMs = 25000 } = {}) => {
  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          ...toHfAuthHeaders(),
        },
        timeout: timeoutMs,
      });
    } catch (e) {
      lastError = e;
      const status = e?.response?.status;
      const msg = String(e?.message || "");
      const retryable = status === 429 || status === 503 || /timeout/i.test(msg);
      if (attempt < 2 && retryable) {
        await new Promise((r) => setTimeout(r, 900 * attempt));
        continue;
      }
      break;
    }
  }
  throw lastError || new Error("Hugging Face request failed");
};

const parseHfClassification = (data) => {
  // HF can return: [{label,score}, ...] OR [[{label,score}...]]
  if (Array.isArray(data) && data.length && Array.isArray(data[0])) return data[0];
  if (Array.isArray(data)) return data;
  return [];
};

const localSentiment = (text) => {
  const tokens = tokenize(text);
  let pos = 0;
  let neg = 0;
  for (const t of tokens) {
    if (POS_WORDS.has(t)) pos += 1;
    if (NEG_WORDS.has(t)) neg += 1;
  }
  const total = pos + neg;
  const score = total ? (pos - neg) / total : 0;
  const label = score > 0.15 ? "POSITIVE" : score < -0.15 ? "NEGATIVE" : "NEUTRAL";
  return { label, score: Math.abs(score), raw: { pos, neg, total } };
};

export const classifySentiment = async (text, { modelId } = {}) => {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return { label: "NEUTRAL", score: 0, model: "none" };

  if (!HUGGINGFACE_API_KEY) {
    const loc = localSentiment(cleaned);
    return { label: loc.label, score: clamp(loc.score, 0, 1), model: "local-lexicon-v1" };
  }

  const m = modelId || getReviewSentimentModelId();
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(m)}`;
  let scores = [];
  try {
    const res = await hfPostWithRetry(url, { inputs: cleaned });
    scores = parseHfClassification(res.data);
  } catch (e) {
    // HF can fail for gated/removed models, quota, or transient outages.
    // Fall back to a local heuristic instead of failing the request.
    const loc = localSentiment(cleaned);
    return { label: loc.label, score: clamp(loc.score, 0, 1), model: "local-lexicon-v1" };
  }
  if (!scores.length) {
    const loc = localSentiment(cleaned);
    return { label: loc.label, score: clamp(loc.score, 0, 1), model: "local-lexicon-v1" };
  }

  const best = scores.reduce((a, b) => (b.score > a.score ? b : a), scores[0]);
  const rawLabel = String(best.label || "").toUpperCase();
  const label =
    rawLabel.includes("POS") ? "POSITIVE" : rawLabel.includes("NEG") ? "NEGATIVE" : "NEUTRAL";
  return { label, score: clamp(Number(best.score) || 0, 0, 1), model: m };
};

const jaccardSimilarity = (aTokens, bTokens) => {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
};

export const detectFakeReviewHeuristics = (text) => {
  const cleaned = normalizeWhitespace(text);
  const tokens = tokenize(cleaned);
  const len = cleaned.length;

  const reasons = [];
  let score = 0;

  const exclam = (cleaned.match(/!/g) || []).length;
  if (exclam >= 4) {
    score += 0.15;
    reasons.push("Excessive exclamation marks");
  }

  const allCapsWords = (cleaned.match(/\b[A-Z]{4,}\b/g) || []).length;
  if (allCapsWords >= 2) {
    score += 0.12;
    reasons.push("Excessive ALL-CAPS words");
  }

  if (tokens.length <= 4) {
    score += 0.18;
    reasons.push("Very short review");
  }

  if (len >= 900) {
    score += 0.1;
    reasons.push("Unusually long review");
  }

  const incentive = /\b(free|refund|cashback|incentive|sponsored|paid)\b/i.test(cleaned);
  if (incentive) {
    score += 0.22;
    reasons.push("Mentions incentives/sponsorship");
  }

  const superlatives = /\b(best|perfect|worst|must[- ]buy|highly recommend|life[- ]changing)\b/i.test(
    cleaned,
  );
  if (superlatives && tokens.length <= 20) {
    score += 0.12;
    reasons.push("Very generic superlatives");
  }

  const freq = new Map();
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  const topCount = Math.max(0, ...Array.from(freq.values()));
  const repetitionRatio = tokens.length ? topCount / tokens.length : 0;
  if (repetitionRatio >= 0.22 && tokens.length >= 12) {
    score += 0.12;
    reasons.push("Repetitive wording");
  }

  return {
    score: clamp(score, 0, 1),
    reasons,
  };
};

const extractKeywords = (text) => {
  const toks = tokenize(text).filter((t) => !STOPWORDS.has(t) && t.length >= 4 && !/^\d+$/.test(t));
  const uniq = [];
  const seen = new Set();
  for (const t of toks) {
    if (seen.has(t)) continue;
    seen.add(t);
    uniq.push(t);
    if (uniq.length >= 5) break;
  }
  return uniq;
};

const themeKeyForClause = (clause) => {
  const kws = extractKeywords(clause);
  if (!kws.length) return "general";
  return kws.slice(0, 2).join(" ");
};

export const analyzeReviews = async (
  reviews = [],
  {
    sentimentModelId,
    includeSummary = true,
    maxProsConsPerReview = 3,
    existingReviewTextsForDupCheck = [],
  } = {},
) => {
  const normalized = (Array.isArray(reviews) ? reviews : [])
    .map((r) => {
      if (typeof r === "string") return { text: r };
      return { text: r?.text, rating: r?.rating, title: r?.title };
    })
    .map((r) => ({
      ...r,
      text: normalizeWhitespace(r.text),
    }))
    .filter((r) => r.text);

  const perReview = [];
  const allPositiveClauses = [];
  const allNegativeClauses = [];

  const reviewTokens = normalized.map((r) => tokenize(r.text));
  const allTexts = normalized.map((r) => r.text);

  for (let i = 0; i < normalized.length; i += 1) {
    const r = normalized[i];
    const clauses = splitIntoClauses(r.text).slice(0, 10);

    const overall = await classifySentiment(r.text, { modelId: sentimentModelId });
    const clauseSentiments = [];
    for (const c of clauses) {
      const s = await classifySentiment(c, { modelId: sentimentModelId });
      clauseSentiments.push({ text: c, ...s });
    }

    const pros = clauseSentiments
      .filter((c) => c.label === "POSITIVE" && c.score >= 0.55)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxProsConsPerReview)
      .map((c) => c.text);
    const cons = clauseSentiments
      .filter((c) => c.label === "NEGATIVE" && c.score >= 0.55)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxProsConsPerReview)
      .map((c) => c.text);

    for (const p of pros) allPositiveClauses.push(p);
    for (const c of cons) allNegativeClauses.push(c);

    const fake = detectFakeReviewHeuristics(r.text);

    // duplicate check within batch + (optional) against existing texts
    let duplicateSimilarity = 0;
    let duplicateIndex = null;
    for (let j = 0; j < i; j += 1) {
      const sim = jaccardSimilarity(reviewTokens[i], reviewTokens[j]);
      if (sim > duplicateSimilarity) {
        duplicateSimilarity = sim;
        duplicateIndex = j;
      }
    }
    if (existingReviewTextsForDupCheck?.length) {
      for (let k = 0; k < existingReviewTextsForDupCheck.length; k += 1) {
        const sim = jaccardSimilarity(
          reviewTokens[i],
          tokenize(existingReviewTextsForDupCheck[k]),
        );
        if (sim > duplicateSimilarity) {
          duplicateSimilarity = sim;
          duplicateIndex = `existing:${k}`;
        }
      }
    }

    const dupFlag = duplicateSimilarity >= 0.86;
    const fakeScore = clamp(fake.score + (dupFlag ? 0.3 : 0), 0, 1);
    const fakeReasons = [...fake.reasons];
    if (dupFlag) fakeReasons.push("Very similar to another review");

    perReview.push({
      index: i,
      title: r.title || "",
      rating: Number.isFinite(Number(r.rating)) ? Number(r.rating) : null,
      text: r.text,
      overallSentiment: overall,
      clauses: clauseSentiments,
      pros,
      cons,
      fake: {
        score: fakeScore,
        reasons: fakeReasons,
        duplicateOf: dupFlag ? duplicateIndex : null,
        similarity: dupFlag ? duplicateSimilarity : null,
      },
    });
  }

  const aggregate = await buildAggregateInsights({
    reviews: perReview,
    allTexts,
    allPositiveClauses,
    allNegativeClauses,
    includeSummary,
  });

  return {
    model: {
      sentiment: HUGGINGFACE_API_KEY ? getReviewSentimentModelId() : "local-lexicon-v1",
      summary: HUGGINGFACE_API_KEY ? getReviewSummaryModelId() : "none",
      provider: HUGGINGFACE_API_KEY ? "huggingface-inference-api" : "local",
    },
    count: perReview.length,
    reviews: perReview,
    aggregate,
  };
};

const trySummarizeWithHF = async (text) => {
  if (!HUGGINGFACE_API_KEY) return null;
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return null;

  const modelId = getReviewSummaryModelId();
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(modelId)}`;

  try {
    const res = await hfPostWithRetry(
      url,
      {
        inputs: cleaned.slice(0, 3500),
        parameters: { max_length: 110, min_length: 40, do_sample: false },
      },
      { timeoutMs: 40000 },
    );

    const out = Array.isArray(res.data) ? res.data[0] : res.data;
    const summaryText = normalizeWhitespace(out?.summary_text || out?.generated_text || "");
    return summaryText || null;
  } catch (e) {
    return null;
  }
};

export const buildAggregateInsights = async ({
  reviews = [],
  allTexts = [],
  allPositiveClauses = [],
  allNegativeClauses = [],
  includeSummary = true,
} = {}) => {
  const sentimentCounts = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };
  let fakeSuspicious = 0;

  const prosThemes = new Map();
  const consThemes = new Map();

  const addTheme = (map, clause) => {
    const key = themeKeyForClause(clause);
    const cur = map.get(key) || { count: 0, examples: [] };
    cur.count += 1;
    if (cur.examples.length < 2) cur.examples.push(clause);
    map.set(key, cur);
  };

  for (const r of reviews) {
    const lbl = r?.overallSentiment?.label || "NEUTRAL";
    if (sentimentCounts[lbl] != null) sentimentCounts[lbl] += 1;
    else sentimentCounts.NEUTRAL += 1;
    if ((r?.fake?.score || 0) >= 0.65) fakeSuspicious += 1;

    for (const p of r?.pros || []) addTheme(prosThemes, p);
    for (const c of r?.cons || []) addTheme(consThemes, c);
  }

  const topThemes = (map) =>
    Array.from(map.entries())
      .map(([theme, v]) => ({ theme, count: v.count, examples: v.examples }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

  const total = reviews.length || 0;
  const fakeRate = total ? fakeSuspicious / total : 0;

  const concat = allTexts.join(" | ");
  const combinedShort = normalizeWhitespace(concat).slice(0, 6000);
  const summaryText = includeSummary ? await trySummarizeWithHF(combinedShort) : null;

  return {
    sentiment: {
      counts: sentimentCounts,
      total,
    },
    suspicious: {
      count: fakeSuspicious,
      rate: clamp(fakeRate, 0, 1),
    },
    pros: topThemes(prosThemes),
    cons: topThemes(consThemes),
    summaryText,
  };
};
