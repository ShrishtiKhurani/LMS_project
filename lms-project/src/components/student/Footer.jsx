import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#0D1B2A] to-[#212d44] text-gray-300 py-10 px-6 md:px-12 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 border-b border-gray-700 pb-8">
        {/*Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Edemy</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Empowering learners worldwide with high-quality, flexible, and
            accessible education. Start your journey toward success today.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Subscribe to our Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Get the latest updates and offers straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} Edemy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
