import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (evt) => {
    evt.preventDefault();
    navigate(`/course-list/${input}`);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="flex items-center max-w-xl w-full sm:w-3/4 md:w-1/2 lg:w-2/5 
              bg-white/90 backdrop-blur-md border border-gray-200 
                rounded-full shadow-md px-3 sm:px-5 py-2 gap-2 
                focus-within:shadow-xl transition-all duration-300"
    >
      {/* Search Icon */}
      <img
        src={assets.search_icon}
        alt="search_icon"
        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
      />

      {/* Input Field */}
      <input
        onChange={(evt) => setInput(evt.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses"
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 
                   text-sm sm:text-base"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700 
                text-white text-sm sm:text-base px-5 sm:px-8 py-2 sm:py-2.5 
                rounded-full font-medium shadow-md hover:shadow-lg 
                transition-all duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
