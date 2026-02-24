import React, { useState } from "react";
import ReactDOM from "react-dom";
import { IoClose, IoCloudUploadOutline, IoSparkles } from "react-icons/io5";
import { toast } from "react-toastify";
import { generateTryOnResult } from "../utils/huggingfaceService";
import Loading from "./Loading";

function TryOutfitModal({ isOpen, onClose, productImageUrl }) {
  const [userImage, setUserImage] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result);
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!userImage) {
      toast.error("Please upload your photo first");
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generateTryOnResult(productImageUrl, userImage);
      setResult(data);
      toast.success("Look generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate look");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Input/Upload */}
        <div className="flex-1 p-8 border-r border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Try This Outfit</h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product</p>
                <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={productImageUrl} alt="Product" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Photo</p>
                <label className="block aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary transition-colors cursor-pointer relative group">
                  {userImagePreview ? (
                    <img src={userImagePreview} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                      <IoCloudUploadOutline size={32} className="mb-2" />
                      <span className="text-xs font-bold">Upload Photo</span>
                    </div>
                  )}
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userImage}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all ${
                isGenerating || !userImage 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-primary text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isGenerating ? <Loading /> : (
                <>
                  <IoSparkles className="text-xl" />
                  Experience LookSync AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Result */}
        <div className="flex-1 bg-gray-50 p-8 flex flex-col relative overflow-y-auto">
          <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors z-10">
            <IoClose size={24} />
          </button>

          {!result && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                <IoSparkles size={32} className="text-gray-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ready to Visualize?</h3>
                <p className="text-sm max-w-[200px] mx-auto">Upload your photo and click generate to see the magic.</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <IoSparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
              </div>
              <p className="text-sm font-bold text-gray-900 animate-pulse tracking-widest uppercase">Processing with Gemini AI...</p>
            </div>
          )}

          {result && (
            <div className="flex-1 flex flex-col space-y-6 animate-fade-in">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Visualization</p>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white relative group">
                  <img src={result.imageUrl} alt="Result" className="w-full h-full object-cover" />
                  {/* Visual indication of AI overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-white bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase">
                       <IoSparkles />
                       AI Vision
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Analytics Section */}
              {result.analytics && (
                  <div className="space-y-4 animate-fade-in delay-100">
                      
                      {/* Detailed Analysis Grid */}
                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">You</p>
                              </div>
                              <p className="text-sm font-bold text-gray-800 capitalize leading-tight">{result.analytics.userAnalysis.bodyShape}</p>
                              <p className="text-xs text-gray-500 capitalize">{result.analytics.userAnalysis.skinTone}</p>
                          </div>
                          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item</p>
                              </div>
                              <p className="text-sm font-bold text-gray-800 capitalize leading-tight">{result.analytics.productAnalysis.style}</p>
                              <p className="text-xs text-gray-500 capitalize">{result.analytics.productAnalysis.occasion}</p>
                          </div>
                      </div>

                      {/* Compatibility Score */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-600"></div>
                          <div className="flex justify-between items-end mb-2">
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Match Score</p>
                                <p className="text-xs text-gray-500 leading-tight pr-4">{result.analytics.compatibility.reason}</p>
                              </div>
                              <span className="text-3xl font-black text-primary leading-none">{result.analytics.compatibility.score}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                              <div className="bg-gradient-to-r from-primary to-purple-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${result.analytics.compatibility.score}%` }}></div>
                          </div>
                      </div>
                  </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Styling Advice</p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-primary">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {result.text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TryOutfitModal;
