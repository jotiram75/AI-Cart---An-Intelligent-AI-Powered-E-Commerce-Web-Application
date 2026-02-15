import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCartOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import RelatedProduct from "../component/RelatedProduct";
import Loading from "../component/Loading";
import Title from "../component/Title";
import TryOutfitModal from "../component/TryOutfitModal";
import { IoSparkles } from "react-icons/io5";
import { useChat } from "../context/ChatContext";

function ProductDetail() {
  const { productId } = useParams();
  const { products, currency, addtoCart, loading } =
    useContext(shopDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [productData, setProductData] = useState(false);

  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [size, setSize] = useState("");
  const [isTryOutfitOpen, setIsTryOutfitOpen] = useState(false);
  const { openChat } = useChat();

  const fetchProductData = async () => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      const productImages = [
        foundProduct.image1,
        foundProduct.image2,
        foundProduct.image3,
        foundProduct.image4,
      ].filter(Boolean);
      setImages(productImages);
      setMainImage(foundProduct.image1);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setMainImage(images[(currentIndex + 1) % images.length]);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setMainImage(images[(currentIndex - 1 + images.length) % images.length]);
  };

  return productData ? (
    <div className="pt-24 md:pt-32 transition-all duration-500 container mx-auto px-4 pb-20 animate-fade-in">
      {/* Product Data */}
      <div className="flex gap-12 lg:gap-20 flex-col md:flex-row items-start">
        {/* Product Images Gallery */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4 w-full">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-3 md:w-24 w-full scrollbar-hide">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  setMainImage(img);
                  setCurrentIndex(index);
                }}
                className={`relative flex-shrink-0 w-20 md:w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                  img === mainImage
                    ? "border-primary shadow-md scale-95"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt={`Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="relative flex-1 max-h-[70vh] aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group shadow-sm flex items-center justify-center">
            <img
              src={mainImage}
              className="w-full h-full object-contain transition-transform duration-700 md:group-hover:scale-105"
              alt={productData.name}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <IoChevronBackOutline className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <IoChevronForwardOutline className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full tracking-widest uppercase">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full lg:max-w-xl">
          <div className="space-y-2">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
              New Arrival
            </span>
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight tracking-tight">
              {productData.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1 text-yellow-400">
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />
              <FaStarHalfAlt className="text-sm" />
            </div>
            <span className="text-gray-400 text-sm font-medium">|</span>
            <p className="text-gray-500 text-sm font-medium hover:text-gray-900 cursor-pointer transition-colors">
              122 Customer Reviews
            </p>
          </div>

          <div className="mt-8 flex items-baseline gap-4">
            <p className="text-4xl font-bold text-gray-900 tracking-tighter">
              {currency}
              {productData.price}
            </p>
            <p className="text-lg text-gray-400 line-through font-medium">
              {currency}
              {(productData.price * 1.2).toFixed(0)}
            </p>
          </div>

          <p className="mt-8 text-gray-600 leading-relaxed text-lg border-l-4 border-primary pl-6 py-2">
            {productData.description}
          </p>

          {productData.subCategory === "TopWear" && (
            <div className="mt-8">
              <button
                onClick={() => setIsTryOutfitOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 border-2 border-primary/20"
              >
                <IoSparkles className="text-xl animate-pulse" />
                Try This Outfit (LookSync AI)
              </button>
              {/* Product Specific Chatbot */}
              <button 
                  onClick={() => openChat('product', productData)}
                  className="w-full sm:w-auto bg-gray-100 text-gray-800 px-8 py-3 rounded-2xl font-bold uppercase tracking-widest shadow-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-3 border border-gray-200 mt-4"
              >
                  <IoSparkles className="text-primary" />
                  Ask AI Assistant
              </button>
            </div>
          )}

          <div className="flex flex-col gap-6 my-10">
            <div className="flex items-center justify-between">
              <p className="text-gray-900 font-bold uppercase tracking-widest text-xs">
                Select Size
              </p>
              <button className="text-primary text-xs font-bold hover:underline">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {(() => {
                let sizesArray = [];
                if (Array.isArray(productData.sizes)) {
                  sizesArray = productData.sizes;
                } else if (typeof productData.sizes === "string") {
                  try {
                    sizesArray = JSON.parse(productData.sizes);
                  } catch (e) {
                    sizesArray = [];
                  }
                }

                return sizesArray && sizesArray.length > 0 ? (
                  sizesArray.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSize(item)}
                      className={`min-w-[4rem] h-12 flex items-center justify-center rounded-xl font-bold border-2 transition-all duration-300 relative overflow-hidden ${
                        item === size
                          ? "border-primary bg-primary text-white shadow-xl scale-105"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm font-medium italic">
                    No sizes available for this product
                  </p>
                );
              })()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() =>
                userData ? addtoCart(productData._id, size) : navigate("/login")
              }
              className="flex-1 bg-gray-900 text-white px-8 py-5 text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loading />
              ) : (
                <>
                  <IoCartOutline className="text-xl" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "100% Original Product",
              "Cash on Delivery Available",
              "Easy 7-day Returns",
              "Free Global Shipping",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-gray-500 font-medium bg-gray-50/50 p-4 rounded-xl border border-gray-100/50"
              >
                <IoCheckmarkCircleOutline className="text-primary text-xl" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className="mt-32">
        <div className="flex border-b border-gray-100 gap-8 mb-8">
          <button className="relative py-4 text-sm font-black uppercase tracking-widest text-gray-900">
            Description
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
          </button>
          <button className="py-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
            Reviews (122)
          </button>
        </div>
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm leading-relaxed text-gray-600 text-lg space-y-6">
          <p>
            Experience the perfect blend of style, comfort, and durability with
            this premium {productData.name}. Meticulously crafted using
            high-quality materials, this piece is designed to elevate your
            everyday ensemble while providing unmatched versatility.
          </p>
          <p>
            Whether you're heading to a casual brunch or an evening gathering,
            its timeless silhouette and attention to detail ensure you make a
            sophisticated statement. Our commitment to quality means every
            stitch is placed with precision, promising a product that lasts as
            long as your memories of it.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-32">
        <Title text1={"YOU MIGHT"} text2={"ALSO LIKE"} />
        <div className="mt-10">
          <RelatedProduct
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
          />
        </div>
      </div>

      <TryOutfitModal
        isOpen={isTryOutfitOpen}
        onClose={() => setIsTryOutfitOpen(false)}
        productImageUrl={productData.image1}
      />
    </div>
  ) : (
    <div className="h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
}

export default ProductDetail;
