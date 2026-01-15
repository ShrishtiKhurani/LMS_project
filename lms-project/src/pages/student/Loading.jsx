import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="flex flex-col items-center gap-6">

        {/* Animated Gradient Ring */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-gray-950"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-wide">
            Processing your payment
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Please don’t refresh or close this page
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
        </div>

      </div>
    </div>
  );
};

export default Loading;
