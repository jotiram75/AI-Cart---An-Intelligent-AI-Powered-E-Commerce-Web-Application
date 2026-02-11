import React, { useContext } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { IoHeartOutline, IoTrashOutline, IoCartOutline } from 'react-icons/io5';
import Card from '../component/Card';
import Title from '../component/Title';

const Wishlist = () => {
  const { wishlistItems, products, currency, toggleWishlist, addtoCart } = useContext(shopDataContext);
  const navigate = useNavigate();

  const wishlistedProducts = products.filter(product => wishlistItems.includes(product._id));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[60vh]">
      <div className="text-2xl mb-8">
        <Title text1={'MY'} text2={'WISHLIST'} />
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <IoHeartOutline className="w-12 h-12 text-gray-300" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2 text-sm">Save your favorite items here to keep track of them.</p>
          </div>
          <button
            onClick={() => navigate('/collection')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all uppercase tracking-wider text-sm shadow-lg active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistedProducts.map((item) => (
            <div key={item._id} className="w-full">
              <Card name={item.name} id={item._id} price={item.price} image={item.image1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
