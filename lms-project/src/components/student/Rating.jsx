import React, { useEffect, useState } from "react";

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);
  return (
   <div className="flex items-center gap-2 mt-1">
  {Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    return (
      <span
        key={index}
        onClick={() => handleRating(starValue)}
        className={`text-2xl sm:text-3xl cursor-pointer transition-all duration-200 
          ${starValue <= rating ? "text-yellow-500 scale-110" : "text-gray-300"}`}
      >
        &#9733;
      </span>
    );
  })}
</div>

  );
};

export default Rating;
