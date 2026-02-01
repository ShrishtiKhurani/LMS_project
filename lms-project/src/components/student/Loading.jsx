import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-white">
      <div className="flex flex-col items-center gap-4">

        {/* bubble loader */}
        <div className="relative flex items-center justify-center">
          {/* glow ring */}
          <span className="absolute w-16 h-16 rounded-full bg-blue-500/10 blur-md animate-pulse"></span>

          {/* ping ring */}
          <span className="absolute w-14 h-14 rounded-full border border-blue-300 animate-ping"></span>

          {/* core bubble */}
          <span className="w-7 h-7 rounded-full bg-blue-600 shadow-lg animate-pulse"></span>
        </div>

        {/* text */}
        <p className="text-sm font-semibold text-gray-800 tracking-wide">
          Loading <span className="text-blue-600">your Courses</span>
        </p>

        {/* progress dots */}
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></span>
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-300"></span>
        </div>

      </div>
    </div>
  );
};

export default Loading;
