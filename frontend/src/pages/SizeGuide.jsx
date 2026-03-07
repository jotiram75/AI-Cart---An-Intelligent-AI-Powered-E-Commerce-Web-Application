import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { authDataContext } from "../context/AuthContext";

const SizeGuide = () => {
  const { serverUrl } = useContext(authDataContext);
  const [activeTab, setActiveTab] = useState("women");
  const [garmentType, setGarmentType] = useState("topwear");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bodyType, setBodyType] = useState("average");
  const [fitPreference, setFitPreference] = useState("regular");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const tabs = ["women", "men", "kids"];

  const sizeData = useMemo(
    () => ({
      women: [
        { size: "XS", us: "0-2", bust: "31-32", waist: "24-25", hips: "33-34" },
        { size: "S", us: "4-6", bust: "33-35", waist: "26-27", hips: "35-37" },
        { size: "M", us: "8-10", bust: "36-37", waist: "28-29", hips: "38-40" },
        { size: "L", us: "12-14", bust: "38-40", waist: "30-32", hips: "41-43" },
        { size: "XL", us: "16", bust: "41-43", waist: "33-35", hips: "44-46" },
      ],
      men: [
        { size: "S", us: "34-36", chest: "34-36", waist: "28-30", neck: "14-14.5" },
        { size: "M", us: "38-40", chest: "38-40", waist: "32-34", neck: "15-15.5" },
        { size: "L", us: "42-44", chest: "42-44", waist: "36-38", neck: "16-16.5" },
        { size: "XL", us: "46-48", chest: "46-48", waist: "40-42", neck: "17-17.5" },
        { size: "XXL", us: "50-52", chest: "50-52", waist: "44-46", neck: "18-18.5" },
      ],
      kids: [
        { size: "S", age: "4-5", height: "40-44", weight: "35-45 lbs" },
        { size: "M", age: "6-7", height: "45-49", weight: "46-60 lbs" },
        { size: "L", age: "8-9", height: "50-55", weight: "61-75 lbs" },
        { size: "XL", age: "10-12", height: "56-60", weight: "76-95 lbs" },
      ],
    }),
    [],
  );

  const onRecommend = async () => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!h || !w) {
      toast.error("Please enter height and weight.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post(`${serverUrl}/api/ai/size-recommend`, {
        gender: activeTab,
        garmentType,
        heightCm: h,
        weightKg: w,
        bodyType,
        fitPreference,
        k: 5,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Size recommendation failed");
      }
      setResult(data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Size recommendation failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold mb-2 text-center">AI Size Finder</h1>
      <p className="text-center text-gray-600 mb-10">
        Enter your height, weight, and body type — our KNN model predicts the
        best fit size to reduce returns.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setResult(null);
              }}
              className={`px-8 py-3 text-sm font-medium uppercase tracking-wide transition-all border-b-2 ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Garment Type
              </label>
              <select
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                <option value="topwear">Topwear (t-shirt, shirt, hoodie)</option>
                <option value="bottomwear">
                  Bottomwear (jeans, pants, shorts)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Body Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                <option value="slim">Slim</option>
                <option value="average">Average</option>
                <option value="athletic">Athletic</option>
                <option value="curvy">Curvy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Height (cm)
              </label>
              <input
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                type="number"
                min={80}
                max={210}
                placeholder="e.g. 170"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Weight (kg)
              </label>
              <input
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                type="number"
                min={10}
                max={160}
                placeholder="e.g. 65"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Fit Preference
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "slim", label: "Slim fit" },
                  { key: "regular", label: "Regular" },
                  { key: "loose", label: "Loose/Comfort" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setFitPreference(opt.key)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      fitPreference === opt.key
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onRecommend}
            disabled={loading}
            className="mt-6 w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            type="button"
          >
            {loading ? "Calculating..." : "Recommend Size"}
          </button>

          {result?.recommendation?.size && (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Recommended Size
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {result.recommendation.size}
                  </p>
                  {typeof result.recommendation.confidence === "number" && (
                    <p className="text-sm text-gray-600 mt-2">
                      Confidence:{" "}
                      {(result.recommendation.confidence * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Alternatives
                  </p>
                  <div className="mt-2 flex flex-wrap justify-end gap-2">
                    {(result.recommendation.alternatives || []).map((a) => (
                      <span
                        key={a.size}
                        className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-800"
                      >
                        {a.size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ul className="mt-4 text-sm text-gray-600 list-disc pl-5 space-y-1">
                {(result.notes || []).map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowChart((v) => !v)}
            className="text-primary font-semibold hover:underline"
            type="button"
          >
            {showChart ? "Hide reference size chart" : "Show reference size chart"}
          </button>
        </div>

        {showChart && (
          <div className="mt-4 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm uppercase">
                  <th className="p-4 font-semibold">Size</th>
                  {activeTab === "women" && (
                    <>
                      <th className="p-4 font-semibold">US Size</th>
                      <th className="p-4 font-semibold">Bust (in)</th>
                      <th className="p-4 font-semibold">Waist (in)</th>
                      <th className="p-4 font-semibold">Hips (in)</th>
                    </>
                  )}
                  {activeTab === "men" && (
                    <>
                      <th className="p-4 font-semibold">US Size</th>
                      <th className="p-4 font-semibold">Chest (in)</th>
                      <th className="p-4 font-semibold">Waist (in)</th>
                      <th className="p-4 font-semibold">Neck (in)</th>
                    </>
                  )}
                  {activeTab === "kids" && (
                    <>
                      <th className="p-4 font-semibold">Age (yrs)</th>
                      <th className="p-4 font-semibold">Height (in)</th>
                      <th className="p-4 font-semibold">Weight</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sizeData[activeTab].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{row.size}</td>
                    {activeTab === "women" && (
                      <>
                        <td className="p-4 text-gray-600">{row.us}</td>
                        <td className="p-4 text-gray-600">{row.bust}</td>
                        <td className="p-4 text-gray-600">{row.waist}</td>
                        <td className="p-4 text-gray-600">{row.hips}</td>
                      </>
                    )}
                    {activeTab === "men" && (
                      <>
                        <td className="p-4 text-gray-600">{row.us}</td>
                        <td className="p-4 text-gray-600">{row.chest}</td>
                        <td className="p-4 text-gray-600">{row.waist}</td>
                        <td className="p-4 text-gray-600">{row.neck}</td>
                      </>
                    )}
                    {activeTab === "kids" && (
                      <>
                        <td className="p-4 text-gray-600">{row.age}</td>
                        <td className="p-4 text-gray-600">{row.height}</td>
                        <td className="p-4 text-gray-600">{row.weight}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 bg-blue-50 p-6 rounded-xl flex gap-4 items-start">
          <div className="bg-white p-2 rounded-full shadow-sm text-xl">💡</div>
          <div>
            <h3 className="font-bold text-lg mb-1">Pro tip</h3>
            <p className="text-gray-600 text-sm">
              For best accuracy, compare the recommendation with product fit
              notes (e.g. “oversized”, “slim fit”).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;

