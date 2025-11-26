import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="mt-32">
      <div className="flex flex-col md:flex-row gap-10 md:gap-32 border-b pb-8 border-b-gray-200 px-6">
        {/* Left Section */}
        <div>
          <img src={assets.logop} alt="logo" className="max-w-44" />
          <p className="mt-2 text-base font-normal text-primary leading-7">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, illo
            illum. Sed aperiam commodi ut unde temporibus, dolorem laborum culpa
            voluptatem nulla consectetur vero alias fuga vitae animi, illum
            consequatur.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 ">COMPANY</h2>
          <p className="py-1 text-base text-primary hover:text-secondary cursor-pointer">
            Home
          </p>
          <p className="py-1 text-base text-primary hover:text-secondary cursor-pointer">
            About Us
          </p>
          <p className="py-1 text-base text-primary hover:text-secondary cursor-pointer">
            Contact Us
          </p>
          <p className="py-1 text-base text-primary hover:text-secondary cursor-pointer">
            Privacy Policy
          </p>
        </div>

        {/* Right Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 ">GET IN TOUCH</h2>
          <p className="py-1 text-base text-primary hover:text-secondary cursor-pointer">
            +91-8431927643
          </p>
          <p className="py-1 text-base text-primary hover:text-secondary cursor-pointer">
            rakshithml078@gmail.com
          </p>
        </div>
      </div>
      <h2 className="text-center my-4 text-primary">
        Copyright &copy; 2025 Made with &#x2764; by Rakshith M L
      </h2>
    </div>
  );
};

export default Footer;
