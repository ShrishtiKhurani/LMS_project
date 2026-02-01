import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CoursesDetails = () => {
  const { id } = useParams();
  console.log("COURSE ID FROM URL", id);
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    currency,
    calculateRating,
    calculateTotalLecturs,
    calculateChapterTime,
    calculateCourseDuration,
    humanizeDuration,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      console.log("PARAM ID =", id);

      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrolledCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll");
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled");
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <section className="relative min-h-screen bg-gradient-to-b from-white to-cyan-50/40 flex justify-center items-start pt-24 pb-16 px-6 md:px-24">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 w-full max-w-6xl">
          {/* Left Section */}
          <div className="flex-1 z-10 text-gray-600">
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight">
              {courseData.courseTitle}
            </h1>

            <p
              className="pt-4 text-base md:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.slice(0, 215) + "...",
              }}
            ></p>

            {/* Ratings and Students */}
            <div className="flex items-center flex-wrap gap-4 mt-6">
              {/* Rating */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                <p className="text-sm font-medium text-gray-800">
                  {calculateRating(courseData).toFixed(1)}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(calculateRating(courseData))
                          ? assets.star
                          : assets.star_blank
                      }
                      alt="star"
                      className="w-4 h-4"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {courseData.courseRatings?.length || 0}
                  {(courseData.courseRatings?.length || 0) > 1
                    ? "ratings"
                    : "rating"}
                </p>
              </div>

              {/* Students */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                <img
                  src={assets.user_icon}
                  alt="students"
                  className="w-4 h-4 opacity-70"
                />
                <p className="text-sm text-gray-700">
                  {courseData.enrolledStudents?.length || 0}
                  {(courseData.enrolledStudents?.length || 0) > 1
                    ? "students"
                    : "student"}
                </p>
              </div>
            </div>

            {/* Educator */}
            <p className="text-sm mt-5 text-gray-700">
              Course By:
              <span className="text-blue-600 font-medium underline cursor-pointer hover:text-blue-700">
                {courseData.educator.name}
              </span>
            </p>
            {/* Course structure */}
            <div className="pt-10 text-gray-800">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
                Course Structure
              </h2>

              <div className="space-y-4">
                {courseData.courseContent?.map((chapter, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div
                      className="flex items-center justify-between"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className={`transform transition-transform ${
                            openSection[index]
                              ? "rotate-180 w-3 h-3 opacity-70"
                              : "w-3 h-3 opacity-70"
                          }`}
                          src={assets.down_arrow_icon}
                          alt="down_arrow_icon"
                        />
                        <p className="font-medium text-gray-800 text-base md:text-lg">
                          {chapter.chapterTitle}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700">
                        {chapter.chapterContent?.length || 0}
                        {(chapter.chapterContent?.length || 0) > 1
                          ? "lectures"
                          : "lecture"}
                        • {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    <div
                      className={`overflow-hidden transection-all duration-300 ${
                        openSection[index] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <ul className="divide-y divide-gray-200 border border-gray-100 rounded-xl overflow-hidden">
                        {chapter.chapterContent?.map((lecture, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-50 transition-all duration-200"
                          >
                            {/* icon & title */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                                <img
                                  src={assets.play_icon}
                                  alt="play icon"
                                  className="w-4 h-4 opacity-80"
                                />
                              </div>

                              <div>
                                <p className="text-gray-800 font-medium text-sm md:text-base">
                                  {lecture.lectureTitle}
                                </p>
                                {lecture.isPreviewFree && (
                                  <span
                                    onClick={() =>
                                      setPlayerData({
                                        videoId: lecture.lectureUrl
                                          .split("/")
                                          .pop(),
                                      })
                                    }
                                    className="cursor-pointer text-[11px] text-blue-600 font-medium bg-blue-100 px-2 py-[2px] rounded-md mt-1 inline-block hover:bg-blue-200"
                                  >
                                    Preview
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Duration */}
                            <p className="text-sm font-medium text-gray-500">
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                {
                                  units: ["h", "m"],
                                  round: true,
                                }
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 relative inline-block">
                Course Description
                <span className="absolute left-0 -bottom-1 w-2/3 h-0.5 bg-blue-500/70 rounded"></span>
              </h3>

              <p
                className="rich-text text-gray-600 leading-relaxed text-[15px] md:text-base tracking-wide"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              ></p>
            </div>
          </div>

          {/* Right Section (Course Info Card) */}
          <div className="max-w-course-card z-10 shadow-custome-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] ">
            {/* Thumbnail */}
            <div className="relative w-full rounded-t-2xl overflow-hidden">
              {playerData ? (
                <YouTube
                  videoId={playerData.videoId}
                  opts={{
                    playerVars: { autoplay: 1 },
                  }}
                  iframeClassName="w-full h-64 md:h-72"
                />
              ) : (
                <img
                  src={courseData.courseThumbnail}
                  alt={courseData.courseTitle}
                  className="w-full h-64 md:h-72 object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-2 mt-3 mb-2 px-4">
              <img
                className="w-4 h-4 opacity-70"
                src={assets.time_left_clock_icon}
                alt="time left"
              />

              <p className="text-sm text-gray-700">
                <span className="text-red-500 font-semibold">5 Days</span> left
                at this price!
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xl font-semibold text-gray-900">
                  {currency}
                  {courseData.coursePrice.toFixed(2)}
                </p>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                  {courseData.discount}% off
                </span>
              </div>

              <p className="text-sm text-gray-500 line-through mb-4">
                {currency}
                {(
                  courseData.coursePrice /
                  (1 - courseData.discount / 100)
                ).toFixed(0)}
              </p>

              {/* Rating, Duration & Lessons */}
              <div className="flex flex-wrap items-center gap-4 mb-5 text-gray-700 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {courseData.courseRatings.length > 0
                      ? calculateRating(courseData).toFixed(1)
                      : "No ratings yet"}
                  </span>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < Math.floor(calculateRating(courseData))
                            ? assets.star
                            : assets.star_blank
                        }
                        alt="star"
                        className="w-4 h-4"
                      />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-4 w-px bg-gray-300/60"></div>

                {/* Duration */}
                <div className="flex items-center gap-2">
                  <img
                    src={assets.time_clock_icon}
                    alt="course duration"
                    className="w-4 h-4 opacity-70"
                  />
                  <p className="text-gray-600">
                    {calculateCourseDuration(courseData)}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-4 w-px bg-gray-300/60"></div>

                {/* Lessons */}
                <div className="flex items-center gap-2">
                  <img
                    src={assets.lesson_icon || assets.time_clock_icon}
                    alt="lessons"
                    className="w-4 h-4 opacity-70"
                  />
                  <p className="text-gray-600">
                    {calculateTotalLecturs(courseData)} lessons
                  </p>
                </div>
              </div>

              {/* Enroll Button */}
              <button
                onClick={enrolledCourse}
                className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl 
              font-semibold text-sm tracking-wide shadow-md hover:shadow-lg 
              transition-all duration-300"
              >
                {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now 🚀"}
              </button>

              <div className="mt-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                  What’s in the course
                </h3>
                <ul className="space-y-1 text-sm md:text-base text-gray-500/80 list-disc list-inside leading-relaxed">
                  <li>High-quality recorded lectures with lifetime access</li>
                  <li>Hands-on projects and real-world assignments</li>
                  <li>Interactive quizzes to test your learning</li>
                  <li>Certificate upon successful completion</li>
                  <li>Access to private community & mentor support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CoursesDetails;
