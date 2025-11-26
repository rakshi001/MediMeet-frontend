import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div>
      <h1 className="text-center text-2xl my-8 ">
        CONTACT <strong>US</strong>
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-10 mt-12">
        {/* ------left------ */}
        <div>
          <img src={assets.contact_image} alt="" className="w-96" />
        </div>

        {/* -------right------ */}
        <div>
          <h2 className="font-medium ">OUR OFFICE</h2>
          <p className="leading-6 py-4 font-light my-4">
            54709 Willms Station Suite <br /> 350, Washington, USA
          </p>
          <p className="leading-6  font-light">Tel: (415) 555-0132</p>
          <p className="leading-6 mb-4 font-light">
            Email: greatstackdev@gmail.com
          </p>
          <h2 className="font-medium py-2">CARRERS AT MediMeet</h2>
          <p className="font-light my-4">
            Learn more about our teams and job openings
          </p>
          <button className="border p-3 my-4 border-border">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
