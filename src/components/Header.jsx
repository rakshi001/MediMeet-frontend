import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const goto = () => {
    navigate("/appointment");
  };

  return (
    <div className="px-4">
     
      <div className="w-full h-auto mt-8  rounded-2xl bg-custom-bg flex flex-col md:flex-row justify-center items-center ">
        {/* Left Section */}
        <div className="text-center md:text-left sm:py-8">
          <h2 className="text-white font-bold text-xl sm:text-2xl md:text-3xl ml-0 md:ml-12 mt-4 md:mt-0">
            Book Appointment <br /> with Trusted Doctors
          </h2>
          <div className="flex flex-col md:flex-row gap-3 mt-4 md:ml-12 py-4 items-center">
            <img
              src={assets.group_profiles}
              alt="Group Profiles"
              className="w-20 sm:w-24 md:w-28 max-w-full"
            />
            <p className="text-white text-sm sm:text-base max-w-xs md:max-w-md">
              Simply browse through our extensive list of trusted doctors,
              schedule your appointment hassle-free.
            </p>
          </div>
          <button
            onClick={goto}
            className="mt-3 bg-white text-gray-500 justify-start sm:justify-center px-5 py-3 rounded-full md:ml-12 flex gap-3 items-center "
          >
            Book Appointment
            <img src={assets.arrow_icon} alt="" />
          </button>
        </div>
        {/* Right Section */}
        <div className="mt-4 md:mt-0 md:mr-12">
          <img
            src={assets.header_img}
            alt="Header"
            className="w-full max-w-md md:max-w-lg h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
