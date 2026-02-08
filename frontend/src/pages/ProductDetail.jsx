import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from "../component/RelatedProduct";
import Loading from "../component/Loading";

function ProductDetail() {
  const { productId } = useParams();
  const { products, currency, addtoCart, loading } = useContext(shopDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [productData, setProductData] = useState(false);

  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage1(item.image1);
        setImage2(item.image2);
        setImage3(item.image3);
        setImage4(item.image4);
        setImage(item.image1);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t border-gray-200 pt-10 transition-opacity ease-in duration-500 opacity-100 container mx-auto px-4 pb-20">
      
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-start sm:w-[18.7%] w-full">
              {image1 && <img onClick={() => setImage(image1)} src={image1} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover border border-gray-200 hover:border-primary" alt="" />}
              {image2 && <img onClick={() => setImage(image2)} src={image2} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover border border-gray-200 hover:border-primary" alt="" />}
              {image3 && <img onClick={() => setImage(image3)} src={image3} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover border border-gray-200 hover:border-primary" alt="" />}
              {image4 && <img onClick={() => setImage(image4)} src={image4} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer object-cover border border-gray-200 hover:border-primary" alt="" />}
          </div>
          <div className="w-full sm:w-[80%]">
              <img className="w-full h-auto object-cover border border-gray-200" src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
            <h1 className="font-medium text-2xl mt-2 text-gray-800 font-heading">{productData.name}</h1>
            
            <div className="flex items-center gap-1 mt-2">
                <FaStar className="text-yellow-400 text-sm" />
                <FaStar className="text-yellow-400 text-sm" />
                <FaStar className="text-yellow-400 text-sm" />
                <FaStar className="text-yellow-400 text-sm" />
                <FaStarHalfAlt className="text-yellow-400 text-sm" />
                <p className="pl-2 text-gray-500 text-sm">(122)</p>
            </div>

            <p className="mt-5 text-3xl font-medium text-gray-900">{currency}{productData.price}</p>
            <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

            <div className="flex flex-col gap-4 my-8">
                <p className="text-gray-700 font-medium">Select Size</p>
                <div className="flex gap-2">
                    {productData.sizes.map((item, index) => (
                        <button 
                            key={index} 
                            onClick={() => setSize(item)}
                            className={`border py-2 px-4 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors ${item === size ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => userData ? addtoCart(productData._id, size) : navigate('/login')}
                className="bg-primary text-white px-8 py-3 text-sm active:bg-gray-700 font-bold uppercase rounded-full shadow-md hover:shadow-lg transition-all"
            >
                {loading ? <Loading /> : "Add to Cart"}
            </button>

            <hr className="mt-8 sm:w-4/5 border-gray-300" />
            
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
            </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
          <div className="flex border-b border-gray-300">
             <p className="border-b-2 border-primary py-3 px-5 text-sm font-bold text-gray-800">Description</p>
             <p className="py-3 px-5 text-sm text-gray-500">Reviews (122)</p>
          </div>
          <div className="flex flex-col gap-4 border border-t-0 border-gray-300 p-6 text-sm text-gray-500 bg-gray-50">
              <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
              <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
          </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
         <RelatedProduct category={productData.category} subCategory={productData.subCategory} currentProductId={productData._id} />
      </div>

    </div>
  ) : (
    <div className="opacity-0"></div>
  );
}

export default ProductDetail;
