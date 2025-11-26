import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div>
      <h1 className="text-center text-2xl my-8 ">
        ABOUT <strong>US</strong>
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-10 mt-12">
        {/* ------left------ */}
        <div>
          <img src={assets.about_image} alt="" className="w-96" />
        </div>

        {/* -------right------ */}
        <div className="w-[50%]">
          <p className="leading-6 font-light mb-8 ">
            Welcome to MediMeet, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At MediMeet, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className="leading-6 font-light my-8">
            MediMeet is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, MediMeet is here to support you every step of the way
          </p>
          <strong className="my-8">Our Vision</strong>
          <p className="leading-6 font-light my-8">
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it
          </p>
        </div>
      </div>
      <h2 className="text-xl mb-10">
        WHY <strong>CHOOSE US</strong>
      </h2>
      <div className="flex flex-col md:flex-row">
        <div className="border p-10">
          <strong>EFFICIENCY</strong>
          <p className="py-5">
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="border p-10">
          <strong>CONVENIENCE</strong>
          <p className="py-5">
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border p-10">
          <strong>PERSONALIZATION</strong>
          <p className="py-5">
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
