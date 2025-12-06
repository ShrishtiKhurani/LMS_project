import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CourseSection = () => {
  const {allCourses}=useContext(AppContext);
  return (
    <div className="py-16 md:px-40 px-8">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
        Learn from the best
      </h1>

      {/* Paragraph */}
      <p className="mt-2 text-gray-500/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-2">
        Discover our top-rated tutorials crafted by industry experts. Gain
        practical knowledge, sharpen your skills, and learn step by step with
        easy-to-follow lessons designed for real-world success. 
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allCourses.slice(0,4).map((course ,index)=><CourseCard key={index} course={course}/>)}
      </div>

      {/* Button */}
      <Link
        to="/course-list"
        onClick={() => window.scrollTo(0, 0)}
        className="inline-block mt-6 text-gray-700 border border-gray-400/40 
        px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 md:py-3 
        rounded-full text-sm sm:text-base md:text-lg 
        hover:bg-gray-100 hover:text-gray-900 
        transition duration-300"
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CourseSection;
