import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Course List
            </h1>

            <p className="text-gray-500 text-sm md:text-base">
              <span
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Home
              </span>
              <span className="text-gray-400"> / </span>
              <span>Course List</span>
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar data={input} />
        </div>

        {/* Active Search Tag */}
        {input && (
          <div className="flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-md px-6 py-3 mb-8">
            <p className="text-gray-700 font-medium text-sm">
              Showing results for:{" "}
              <span className="text-blue-600">{input}</span>
            </p>
            <img
              src={assets.cross_icon}
              alt="clear search"
              className="w-4 h-4 cursor-pointer hover:rotate-90 transition"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCourse.length > 0 ? (
            filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
              <img
                src={assets.no_result_icon}
                alt="no courses found"
                className="w-36 h-36 opacity-70 mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-700">
                No courses found
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Try searching for something else.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CoursesList;
