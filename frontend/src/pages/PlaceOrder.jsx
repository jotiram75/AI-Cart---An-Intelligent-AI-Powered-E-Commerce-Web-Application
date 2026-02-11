import React, { useContext, useState } from "react";
import Title from "../component/Title";
import CartTotal from "../component/CartTotal";
import razorpay from "../assets/Razorpay.jpg";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../component/Loading";

function PlaceOrder() {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
            const { data } = await axios.post(
            serverUrl + "/api/order/verifyrazorpay",
            response,
            { withCredentials: true },
            );
            if (data) {
                navigate("/order");
                setCartItem({});
            }
        } catch (error) {
            console.log(error);
            toast.error("Payment Verification Failed");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const result = await axios.post(
            serverUrl + "/api/order/placeorder",
            orderData,
            { withCredentials: true },
          );
          if (result.data) {
            setCartItem({});
            toast.success("Order Placed");
            navigate("/order");
            setLoading(false);
          } else {
             toast.error("Order Placed Error");
             setLoading(false);
          }
          break;

        case "razorpay":
          const resultRazorpay = await axios.post(
            serverUrl + "/api/order/razorpay",
            orderData,
            { withCredentials: true },
          );
          if (resultRazorpay.data) {
            initPay(resultRazorpay.data);
            setLoading(false);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <form onSubmit={onSubmitHandler} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Side - Delivery Info */}
          <div className="flex-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-2xl mb-8">
                <Title text1={"DELIVERY"} text2={"INFORMATION"} />
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="text" placeholder="First name" />
                  <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="text" placeholder="Last name" />
                </div>
                <input required onChange={onChangeHandler} name="email" value={formData.email} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="email" placeholder="Email address" />
                <input required onChange={onChangeHandler} name="street" value={formData.street} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="text" placeholder="Street" />
                <div className="flex gap-4">
                  <input required onChange={onChangeHandler} name="city" value={formData.city} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="text" placeholder="City" />
                  <input required onChange={onChangeHandler} name="state" value={formData.state} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="text" placeholder="State" />
                </div>
                <div className="flex gap-4">
                  <input required onChange={onChangeHandler} name="pinCode" value={formData.pinCode} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="number" placeholder="Zipcode" />
                  <input required onChange={onChangeHandler} name="country" value={formData.country} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="text" placeholder="Country" />
                </div>
                <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="number" placeholder="Phone" />
              </div>
            </div>
          </div>

          {/* Right Side - Payment */}
          <div className="flex-1 lg:max-w-md">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
              <div className="mb-8">
                <Title text1={"PAYMENT"} text2={"METHOD"} />
              </div>

              <div className="flex flex-col gap-4">
                <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all ${method === 'razorpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === 'razorpay' ? 'border-primary' : 'border-gray-400'}`}>
                    {method === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <img className="h-6 object-contain" src={razorpay} alt="Razorpay" />
                </div>

                <div onClick={() => setMethod('cod')} className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all ${method === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === 'cod' ? 'border-primary' : 'border-gray-400'}`}>
                    {method === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <p className="font-semibold text-gray-700">Cash on Delivery</p>
                </div>
              </div>

              <button type="submit" className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                {loading ? <Loading /> : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PlaceOrder;
