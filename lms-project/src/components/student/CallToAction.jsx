import React from "react";
import { assets } from "../../assets/assets";

const CallToActionSection = () => {
  return (
    <section className="py-20 px-6 md:px-12 text-center bg-white">
      {/* Heading */}
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight mb-4">
        Learn Anything, Anywhere, Anytime
      </h1>

      {/* Paragraph */}
      <p className="text-base md:text-md text-gray-500/80 max-w-3xl mx-auto mb-8">
        Join thousands of learners worldwide gaining new skills and advancing
        their careers through our expert-led courses — anytime, on any device.
      </p>

      {/* Buttons */}
<div className="flex flex-col sm:flex-row justify-center items-center gap-4">
  <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300">
    Get Started
  </button>

  <button className="border border-blue-300 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition duration-300 flex items-center gap-2">
    Learn More
    <img src={assets.arrow_icon} alt="arrow icon" className="w-4 h-4" />
  </button>
</div>

    </section>
  );
};

export default CallToActionSection;
