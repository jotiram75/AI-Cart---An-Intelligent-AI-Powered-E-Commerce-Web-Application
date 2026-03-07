import axios from "axios";

export const fetchProductReviews = async (serverUrl, productId, { limit = 20, includeSummary = false } = {}) => {
  const res = await axios.get(`${serverUrl}/api/review/${productId}`, {
    params: { limit, includeSummary },
    withCredentials: true,
  });
  return res.data;
};

export const addProductReview = async (serverUrl, productId, { rating, title, text }) => {
  const res = await axios.post(
    `${serverUrl}/api/review/${productId}`,
    { rating, title, text },
    { withCredentials: true },
  );
  return res.data;
};

export const analyzeReviews = async (serverUrl, reviews, { includeSummary = true } = {}) => {
  const res = await axios.post(
    `${serverUrl}/api/ai/reviews/analyze`,
    { reviews, includeSummary },
    { withCredentials: true },
  );
  return res.data;
};

