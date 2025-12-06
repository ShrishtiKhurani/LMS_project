import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="max-w-6xl mx-auto py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
          <img src={assets.logo} alt="logo" className="w-24 opacity-95" />
          <p className="text-gray-600 text-xs">© 2025 MindFuel. All Rights Reserved.</p>
        </div>

        {/* Right Social Icons */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:scale-110 transition">
            <img src={assets.facebook_icon} alt="facebook" className="w-8" />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <img src={assets.instagram_icon} alt="instagram" className="w-8" />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <img src={assets.twitter_icon} alt="twitter" className="w-8" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
