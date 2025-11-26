import React, { useState } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `https://medifypro-backend.onrender.com/api/user/login`,
        {
          email,
          password,
        }
      );
      const data = res.data;
      if (data.success) {
        toast.success("Login Success");
        localStorage.setItem("token", data.token);
console.log(localStorage.getItem("token"));
        navigate("/")
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error.message);
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="shadow-xl p-8 rounded-xl w-96">
        <h2 className="text-primary font-medium text-xl">Login</h2>
        <p className="text-sm mb-3 mt-1">Please login to book appointment</p>
        <div className="mb-2 flex flex-col">
          <label htmlFor="">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-2 flex flex-col">
          <label htmlFor="">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-lg mb-2"
          />
        </div>
        <div>
          <button
            onClick={handleLogin}
            className="w-full py-2 mb-3 bg-custom-bg rounded-lg text-white"
          >
            Login
          </button>
        </div>
        <h2 className="text-sm py-3">
          New here?{" "}
          <span
            onClick={()=>navigate("/sign-up")}
            className="text-blue-500 underline cursor-pointer"
          >
            Sign Up
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Login;
