import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const BottomPanel = () => {
  const navigate = useNavigate();
  const createAccount=() => {
    navigate('/login')
  }
  return (
    <div className="px-4">
      <div className="bg-custom-bg w-full sm:h-auto flex flex-col items-center justify-center md:justify-between md:flex-row mt-20 rounded-2xl gap-4">
        {/* -----left----- */}
        <div className="">
          <h1 className="text-white font-bold text-2xl sm:text-2xl md:text-3xl ml-0 md:ml-12 mt-4 md:mt-0">
            Book Appointment
          </h1>
          <h1 className="text-white font-bold text-2xl sm:text-2xl md:text-3xl ml-0 md:ml-12 mt-4 md:mt-0">
            With 100+ Trusted Doctors
          </h1>
          <button
          onClick={createAccount}  className="mt-8 bg-white text-gray-500 px-5 py-3 rounded-full md:ml-12 flex gap-3 items-center">
            Create Account
          </button>
        </div>
        {/* -----right----- */}
        <div className="mr-12">
          <img
            src={assets.appointment_img}
            alt=""
            className="w-full h-60 mb-0  md:h-80 sm:h-96"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;
