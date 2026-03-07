import React, { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { addProductReview, fetchProductReviews } from "../utils/reviewService";

const Stars = ({ value = 0 }) => {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < v ? "text-xs" : "text-xs text-gray-200"}
        />
      ))}
    </div>
  );
};

const Badge = ({ tone = "gray", children }) => {
  const map = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`px-2 py-0.5 text-[11px] border rounded-full ${map[tone] || map.gray}`}
    >
      {children}
    </span>
  );
};

function ReviewInsights({ serverUrl, productId, canReview }) {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [insights, setInsights] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const sentiment = insights?.sentiment?.counts || {
    POSITIVE: 0,
    NEGATIVE: 0,
    NEUTRAL: 0,
  };
  const total = insights?.sentiment?.total || 0;
  const suspiciousRate = insights?.suspicious?.rate || 0;

  const load = async ({ includeSummary = false } = {}) => {
    setLoading(true);
    let out = null;
    try {
      const data = await fetchProductReviews(serverUrl, productId, {
        limit: 20,
        includeSummary,
      });
      setReviews(data.reviews || []);
      setInsights(data.insights || null);
      out = data;
    } catch {
      toast.error("Failed to load reviews");
      out = null;
    } finally {
      setLoading(false);
    }
    return out;
  };

  useEffect(() => {
    if (!serverUrl || !productId) return;
    load({ includeSummary: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl, productId]);

  const summaryText = insights?.summaryText || null;

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await load({ includeSummary: true });
      const st = data?.insights?.summaryText;
      toast.info(st ? "Summary generated" : "Summary unavailable right now");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!canReview) {
      toast.info("Login to write a review");
      return;
    }
    const clean = String(text || "").trim();
    if (!clean) {
      toast.info("Write something about the product");
      return;
    }

    try {
      await addProductReview(serverUrl, productId, {
        rating,
        title: title.trim(),
        text: clean,
      });
      toast.success("Review submitted");
      setTitle("");
      setText("");
      await load({ includeSummary: false });
    } catch (_e) {
      const msg = _e?.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    }
  };

  const topPros = useMemo(() => insights?.pros || [], [insights]);
  const topCons = useMemo(() => insights?.cons || [], [insights]);

  return (
    <div className="mt-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            AI Review Insights
          </h2>
          <p className="text-sm text-gray-500">
            Pros/cons, sentiment, and suspicious review detection.
          </p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={summaryLoading || loading || total === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60"
          type="button"
          title={total === 0 ? "No reviews yet" : "Generate a short AI summary"}
        >
          {summaryLoading ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Sentiment
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="green">Positive: {sentiment.POSITIVE || 0}</Badge>
            <Badge tone="red">Negative: {sentiment.NEGATIVE || 0}</Badge>
            <Badge tone="gray">Neutral: {sentiment.NEUTRAL || 0}</Badge>
            <Badge tone="amber">
              Suspicious: {Math.round((suspiciousRate || 0) * 100)}%
            </Badge>
          </div>
          {summaryText && (
            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
              {summaryText}
            </div>
          )}
          {!summaryText && total > 0 && (
            <p className="mt-4 text-xs text-gray-400">
              Summary appears after generation.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Top Pros
          </p>
          <div className="mt-3 space-y-3">
            {topPros.length ? (
              topPros.map((p, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900 capitalize">
                      {p.theme}
                    </p>
                    <Badge tone="green">{p.count}</Badge>
                  </div>
                  {p.examples?.[0] && (
                    <p className="text-gray-600 mt-1">“{p.examples[0]}”</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Not enough data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Top Cons
          </p>
          <div className="mt-3 space-y-3">
            {topCons.length ? (
              topCons.map((c, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900 capitalize">
                      {c.theme}
                    </p>
                    <Badge tone="red">{c.count}</Badge>
                  </div>
                  {c.examples?.[0] && (
                    <p className="text-gray-600 mt-1">“{c.examples[0]}”</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Not enough data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Write a review
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const v = i + 1;
                    const active = v <= rating;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setRating(v)}
                        className="p-1"
                        aria-label={`Rate ${v}`}
                      >
                        <FaStar
                          className={
                            active
                              ? "text-yellow-400 text-sm"
                              : "text-gray-200 text-sm"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              {!canReview && <Badge tone="amber">Login required</Badge>}
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience (e.g., “Battery life is poor but camera is excellent”)"
              className="w-full min-h-[110px] px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />

            <button
              onClick={handleSubmit}
              type="button"
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide hover:bg-primary transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Customer reviews
          </p>
          <div className="mt-4 space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : reviews.length ? (
              reviews.map((r) => {
                const sent = r?.sentiment?.label || "NEUTRAL";
                const sentTone =
                  sent === "POSITIVE"
                    ? "green"
                    : sent === "NEGATIVE"
                      ? "red"
                      : "gray";
                const fakeScore = Number(r?.fake?.score) || 0;
                return (
                  <div
                    key={r._id}
                    className="border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Stars value={r.rating} />
                        <Badge tone={sentTone}>
                          {sent.toLowerCase()}{" "}
                          {r?.sentiment?.score
                            ? `(${Math.round(r.sentiment.score * 100)}%)`
                            : ""}
                        </Badge>
                        {fakeScore >= 0.65 && (
                          <Badge tone="amber">suspicious</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {r?.userId?.name ? r.userId.name : "Anonymous"}
                      </p>
                    </div>

                    {r.title && (
                      <p className="mt-2 font-semibold text-gray-900">
                        {r.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-700">{r.text}</p>
                    {fakeScore >= 0.65 && r?.fake?.reasons?.length ? (
                      <p className="mt-2 text-xs text-amber-700">
                        Flagged: {r.fake.reasons.slice(0, 2).join(", ")}
                      </p>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-400">
                No reviews yet. Be the first to review this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewInsights;
