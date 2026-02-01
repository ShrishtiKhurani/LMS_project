import React from "react";
const Loading = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white">
      {/* Animated Spinner */}
      <div className="relative">
        <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-14 h-14 border-4 border-blue-700 opacity-20 rounded-full"></div>
      </div>

      {/* Subtle Text */}
      <h2 className="mt-6 text-2xl font-semibold tracking-wide">Loading...</h2>
      <p className="text-gray-300 mt-2 text-sm animate-pulse">
        Please wait while we prepare your content
      </p>
    </div>
  );
};

export default Loading;
