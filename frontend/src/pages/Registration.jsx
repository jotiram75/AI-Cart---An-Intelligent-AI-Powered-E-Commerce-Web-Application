import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.png";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { userDataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import Loading from "../component/Loading";

function Registration() {
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getCurrentUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/registration",
        { name, email, password },
        { withCredentials: true },
      );
      getCurrentUser();
      navigate("/");
      toast.success("User Registration Successful");
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("User Registration Failed");
      }
      setLoading(false);
    }
  };

  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName;
      const email = user.email;

      const result = await axios.post(
        serverUrl + "/api/auth/googlelogin",
        { name, email },
        { withCredentials: true },
      );
      getCurrentUser();
      navigate("/");
      toast.success("User Registration Successful");
    } catch (error) {
      console.log(error);
      toast.error("User Registration Failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSignup}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl font-heading">Sign Up</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
        
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />
        
        <div className="w-full relative">
            <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={show ? "text" : "password"}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Password"
            required
            />
            <div className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShow(!show)}>
                {show ? <IoEye /> : <IoEyeOutline />}
            </div>
        </div>

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer hover:text-primary transition-colors">Forgot your password?</p>
          <p onClick={() => navigate('/login')} className="cursor-pointer hover:text-primary transition-colors">Login Here</p>
        </div>

        <button className="bg-black text-white font-light px-8 py-2 mt-4 active:bg-gray-700 transition-colors">
          {loading ? <Loading /> : "Sign Up"}
        </button>
        
        <div className="w-full flex items-center justify-center gap-1 mt-2">
            <div className="h-[1px] bg-gray-300 w-full"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-[1px] bg-gray-300 w-full"></div>
        </div>
        
        <button 
            type="button" 
            onClick={googleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 px-8 py-2 mt-2 hover:bg-gray-50 transition-colors"
        >
            <img src={google} alt="Google" className="w-5" />
            <span className="text-gray-600 text-sm">Continue with Google</span>
        </button>

      </form>
    </div>
  );
}

export default Registration;
