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
        {/* Product Images Gallery - Normalized size */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4 w-full">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-3 md:w-20 w-full scrollbar-hide">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  setMainImage(img);
                  setCurrentIndex(index);
                }}
                className={`relative flex-shrink-0 w-16 md:w-20 aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                  img === mainImage
                    ? "border-primary shadow-md"
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

          <div className="relative flex-1 max-h-[60vh] aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group shadow-sm flex items-center justify-center">
            <img
              src={mainImage}
              className="w-full h-full object-contain"
              alt={productData.name}
            />

            {/* Navigation Arrows - Normalized */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <IoChevronBackOutline className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <IoChevronForwardOutline className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Counter - Normalized */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full lg:max-w-xl">
          <div className="space-y-2">
            <span className="text-primary text-xs font-medium uppercase tracking-wider">
              New Arrival
            </span>
            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
              {productData.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-0.5 text-yellow-400">
              <FaStar className="text-xs" />
              <FaStar className="text-xs" />
              <FaStar className="text-xs" />
              <FaStar className="text-xs" />
              <FaStarHalfAlt className="text-xs" />
            </div>
            <span className="text-gray-300 text-sm">|</span>
            <p className="text-gray-500 text-sm hover:text-gray-900 cursor-pointer transition-colors">
              122 Customer Reviews
            </p>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-3xl font-bold text-gray-900">
              {currency}
              {productData.price}
            </p>
            <p className="text-base text-gray-400 line-through">
              {currency}
              {(productData.price * 1.2).toFixed(0)}
            </p>
          </div>

          {/* Description - Shortened/Normalized */}
          <p className="mt-6 text-gray-600 leading-relaxed border-l-2 border-primary pl-4 py-1 text-base">
            Experience the perfect blend of style, comfort, and durability with
            this premium {productData.name}. Meticulously crafted using
            high-quality materials, this piece is designed to elevate your
            everyday ensemble.
          </p>

          {productData.subCategory === "TopWear" && (
            <div className="mt-6">
              <button
                onClick={() => setIsTryOutfitOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <IoSparkles className="text-base" />
                Try This Outfit (LookSync AI)
              </button>
              {/* Product Specific Chatbot */}
              <button
                onClick={() => openChat("product", productData)}
                className="w-full sm:w-auto bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-semibold uppercase tracking-wide shadow-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm mt-3"
              >
                <IoSparkles className="text-primary text-base" />
                Ask AI Assistant
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 my-8">
            <div className="flex items-center justify-between">
              <p className="text-gray-900 font-semibold uppercase tracking-wide text-xs">
                Select Size
              </p>
              <button className="text-primary text-xs hover:underline">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
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
                      className={`min-w-[3.5rem] h-10 flex items-center justify-center rounded-lg font-medium border-2 transition-all duration-300 ${
                        item === size
                          ? "border-primary bg-primary text-white shadow-md"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    No sizes available for this product
                  </p>
                );
              })()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() =>
                userData ? addtoCart(productData._id, size) : navigate("/login")
              }
              className="flex-1 bg-gray-900 text-white px-6 py-4 text-sm font-semibold uppercase tracking-wide rounded-xl shadow-lg hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loading />
              ) : (
                <>
                  <IoCartOutline className="text-lg" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "100% Original Product",
              "Cash on Delivery Available",
              "Easy 7-day Returns",
              "Free Global Shipping",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50/50 p-3 rounded-lg border border-gray-100/50"
              >
                <IoCheckmarkCircleOutline className="text-primary text-base" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      {/* <div className="mt-20">
        <div className="flex border-b border-gray-100 gap-6 mb-6">
          <button className="relative py-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
            Description
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
          </button>
          <button className="py-3 text-xs font-medium uppercase tracking-wide text-gray-400 hover:text-gray-900 transition-colors">
            Reviews (122)
          </button>
        </div>
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm leading-relaxed text-gray-600 space-y-4">
          <p className="text-base">
            Experience the perfect blend of style, comfort, and durability with
            this premium {productData.name}. Meticulously crafted using
            high-quality materials, this piece is designed to elevate your
            everyday ensemble while providing unmatched versatility.
          </p>
          <p className="text-base">
            Whether you're heading to a casual brunch or an evening gathering,
            its timeless silhouette and attention to detail ensure you make a
            sophisticated statement.
          </p>
        </div>
      </div> */}

      {/* Related Products - Renamed to FashionIQ Recommender */}
      <div className="mt-20">
        <Title text1={"FashionIQ"} text2={"Recommender"} />
        <div className="mt-8">
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
