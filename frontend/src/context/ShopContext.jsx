import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";
import { toast } from "react-toastify";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [cartItem, setCartItem] = useState({});
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Persistence for Wishlist
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        toast.info("Removed from Wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        toast.success("Added to Wishlist");
        return [...prev, productId];
      }
    });
  };

  const currency = "₹";
  const delivery_fee = 40;

  // Fetch All Products
  const getProducts = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list");
      setProducts(result.data.filter(product => product));
    } catch (error) {
      console.log(error);
    }
  };

  // Add To Cart
  const addtoCart = async (itemId, size) => {
    if (!size) {
      console.log("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItem(cartData);

    if (userData) {
      setLoading(true);
      try {
        await axios.post(
          serverUrl + "/api/cart/add",
          { itemId, size },
          { withCredentials: true },
        );
        toast.success("Product Added");
      } catch (error) {
        toast.error("Add Cart Error");
      }
      setLoading(false);
    }
  };

  // Fetch User Cart
  const getUserCart = async () => {
    try {
      const result = await axios.post(
        serverUrl + "/api/cart/get",
        {},
        { withCredentials: true },
      );
      setCartItem(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Update Quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (userData) {
      try {
        await axios.post(
          serverUrl + "/api/cart/update",
          { itemId, size, quantity },
          { withCredentials: true },
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Get Total Items in Cart
  const getCartCount = () => {
    let total = 0;
    Object.keys(cartItem).forEach((itemId) => {
      Object.keys(cartItem[itemId]).forEach((size) => {
        total += cartItem[itemId][size];
      });
    });
    return total;
  };

  // Get Total Cart Amount
  const getCartAmount = () => {
    let amount = 0;
    Object.keys(cartItem).forEach((itemId) => {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        Object.keys(cartItem[itemId]).forEach((size) => {
          amount += product.price * cartItem[itemId][size];
        });
      }
    });
    return amount;
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (userData) getUserCart();
  }, [userData]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addtoCart,
    getCartCount,
    setCartItem,
    updateQuantity,
    getCartAmount,
    wishlistItems,
    toggleWishlist,
    loading,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
