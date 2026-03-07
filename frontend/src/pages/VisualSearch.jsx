import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import Card from "../component/Card";
import { toast } from "react-toastify";

function VisualSearch() {
  const { serverUrl } = useContext(authDataContext);
  const [file, setFile] = useState(null);
  const [topK, setTopK] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setResults([]);
    setFile(f);
  };

  const onSearch = async () => {
    if (!file) {
      toast.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const form = new FormData();
      form.append("image", file);
      if (Number(topK) > 0) form.append("topK", String(topK));

      const { data } = await axios.post(
        `${serverUrl}/api/ai/visual-search`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (!data?.success) {
        throw new Error(data?.message || "Visual search failed");
      }
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Visual search failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            AI Visual Search
          </h1>
          <p className="text-gray-600 mt-2">
            Upload an image and find similar products from the catalog using
            image embeddings + cosine similarity.
          </p>

          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Upload a product photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/15"
                />
                {previewUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-72 object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Results
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={topK}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTopK(v === "" ? 0 : Number(v));
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={onSearch}
                  disabled={loading}
                  className="mt-4 w-full bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Searching..." : "Find Similar"}
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Tip: Use a clear product photo (e.g., shoes, bag, dress) for
                  best matches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Similar products
              </h2>
              <span className="text-sm text-gray-600">
                {results.length} results
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((r) => (
                <div key={r.product?._id} className="relative">
                  <Card
                    id={r.product?._id}
                    name={r.product?.name}
                    image={r.product?.image1}
                    price={r.product?.price}
                  />
                  {typeof r.score === "number" && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {(r.score * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VisualSearch;
