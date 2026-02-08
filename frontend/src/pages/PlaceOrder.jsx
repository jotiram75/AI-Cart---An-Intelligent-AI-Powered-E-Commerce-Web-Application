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
    <div className="flex flex-col sm:flex-row justify-between gap-8 pt-12 sm:pt-24 min-h-screen border-t border-gray-200 container mx-auto px-4 bg-white">
      {/* Left Side - Delivery Info */}
      <div className="flex flex-col gap-6 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
             <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            <div className="flex gap-3">
                <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="text" placeholder="First name" />
                <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="text" placeholder="Last name" />
            </div>
            <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="email" placeholder="Email address" />
            <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="text" placeholder="Street" />
            
            <div className="flex gap-3">
                <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="text" placeholder="City" />
                <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="text" placeholder="State" />
            </div>
            
            <div className="flex gap-3">
                <input required onChange={onChangeHandler} name="pinCode" value={formData.pinCode} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="number" placeholder="Zipcode" />
                <input required onChange={onChangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="text" placeholder="Country" />
            </div>
            
            <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded py-2.5 px-3.5 w-full bg-white text-gray-800 focus:border-primary outline-none" type="number" placeholder="Phone" />

            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                
                <div className="mt-12">
                     <Title text1={"PAYMENT"} text2={"METHOD"} />
                     <div className="flex gap-4 flex-col lg:flex-row mt-4">
                        <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border border-gray-200 p-3 px-6 cursor-pointer opacity-50 cursor-not-allowed">
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                             <p className="font-medium text-gray-500 text-sm font-heading mx-4">STRIPE</p>
                        </div>
                         <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border border-gray-200 p-3 px-6 cursor-pointer hover:border-primary">
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-primary border-primary' : ''}`}></p>
                             <img className="h-5 mx-4" src={razorpay} alt="Razorpay" />
                        </div>
                        <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border border-gray-200 p-3 px-6 cursor-pointer hover:border-primary">
                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-primary border-primary' : ''}`}></p>
                             <p className="font-medium text-gray-500 text-sm font-heading mx-4">CASH ON DELIVERY</p>
                        </div>
                     </div>
                     
                     <div className="w-full text-end mt-8">
                         <button type="submit" className="bg-primary text-white px-10 py-3 text-sm font-bold uppercase rounded-full shadow hover:shadow-lg transition-all">
                             {loading ? <Loading /> : "PLACE ORDER"}
                         </button>
                     </div>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
}

export default PlaceOrder;
