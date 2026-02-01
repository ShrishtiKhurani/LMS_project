import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating,} = useContext(AppContext);

  return (
    <Link
      to={course?._id ? "/course/" + course._id : "#"}
      onClick={() => window.scrollTo(0, 0)}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg 
                 transition duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[16/9] bg-gray-100">
        <img
          src={course.courseThumbnail}
          alt="courseThumbnail"
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base sm:text-md font-semibold text-gray-800 line-clamp-2">
          {course.courseTitle}
        </h3>

        {/* Educator */}
        <p className="text-sm text-gray-500 mt-1">{course.educator.name}</p>

        {/* Ratings */}
        <div className="flex items-center gap-2 mt-3 text-left">
          <p className="text-sm font-medium text-gray-700">
            {calculateRating(course).toFixed(1)}
          </p>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>

        <p className="text-xs text-gray-500">{(course.courseRatings.length)}</p>
        </div>

        {/* Price */}
        <div className="mt-3 text-left">
          <p className="text-blue-600 font-bold text-md leading-tight">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>

          {course.discount > 0 && (
            <p className="text-sm text-gray-400 line-through mt-0.5">
              {currency}
              {course.coursePrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
