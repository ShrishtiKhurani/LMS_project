import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";

const Player = () => {
  const {
    enrolledCourse,
    calculateChapterTime,
    getToken,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    enrolledCourse.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (enrolledCourse.length > 0) {
      getCourseData();
    }
  }, [enrolledCourse]);

  const markeLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + `/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + `/api/user/get-course-progress`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      // console.log("rating:", rating);
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        {
          courseId,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  return courseData ? (
    <>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 px-6 sm:px-10 lg:px-20 py-10 bg-gray-50 min-h-screen">
        {/* Left column - Course structure */}
        <div className="w-full lg:w-[50%] rounded-2xl shadow-md p-6 overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 border-b border-gray-200 pb-2">
            Course Structure
          </h2>

          <div className="space-y-4">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition duration-200"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className={`transform transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        } w-3 h-3 opacity-70`}
                        src={assets.down_arrow_icon}
                        alt="down_arrow_icon"
                      />
                      <p className="font-medium text-gray-800 text-base md:text-lg">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {chapter.chapterContent.length}{" "}
                      {chapter.chapterContent.length > 1
                        ? "lectures"
                        : "lecture"}{" "}
                      • {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="divide-y divide-gray-200 border border-gray-100 rounded-xl overflow-hidden mt-3">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between px-4 py-3 bg-white hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                              <img
                                src={
                                  progressData &&
                                  progressData.lectureCompleted.includes(
                                    lecture?.lectureId
                                  )
                                    ? assets.blue_tick_icon
                                    : assets.play_icon
                                }
                                alt="play icon"
                                className="w-4 h-4 opacity-80"
                              />
                            </div>

                            <div>
                              <p className="text-gray-800 font-medium text-sm md:text-base">
                                {lecture.lectureTitle}
                              </p>
                              {lecture.lectureUrl && (
                                <span
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="cursor-pointer text-[11px] text-blue-600 font-medium bg-blue-100 px-2 py-[2px] rounded-md mt-1 inline-block hover:bg-blue-200"
                                >
                                  Watch
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm font-medium text-gray-500">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["h", "m"], round: true }
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border">
            <h1 className="text-lg font-semibold mb-2 text-gray-700">
              Rate this Course:
            </h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right column - Video player */}
        <div className="w-full lg:w-[50%] rounded-2xl shadow-md overflow-hidden flex flex-col justify-start">
          {playerData ? (
            <>
              {/* YouTube video */}
              <div className="relative w-full aspect-video bg-black">
                {playerData?.lectureUrl && (
                  <YouTube
                    videoId={playerData.lectureUrl.split("/").pop()}
                    iframeClassName="absolute top-0 left-0 w-full h-full rounded-t-2xl"
                  />
                )}
              </div>

              {/* Video Info */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-200">
                <p className="text-gray-800 font-medium text-base leading-tight">
                  {playerData.chapter}.{playerData.lecture}{" "}
                  <span className="text-gray-600">
                    {playerData.lectureTitle}
                  </span>
                </p>

                <button
                  onClick={() => markeLectureAsCompleted(playerData?.lectureId)}
                  disabled={
                    progressData &&
                    progressData.lectureCompleted.includes(
                      playerData?.lectureId
                    )
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                   ${
                     progressData &&
                     progressData.lectureCompleted.includes(
                       playerData?.lectureId
                     )
                       ? "bg-green-100 text-green-700 cursor-not-allowed"
                       : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                   }
                `}
                >
                  {progressData &&
                  progressData.lectureCompleted.includes(
                    playerData?.lectureId
                  ) ? (
                    <>
                      ✅ <span>Completed</span>
                    </>
                  ) : (
                    <>
                      ⏱ <span>Mark Complete</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative w-full aspect-video">
                <img
                  src={courseData ? courseData.courseThumbnail : ""}
                  alt={courseData ? courseData.courseTitle : ""}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-5 text-center text-gray-600 text-sm">
                <p>Select a lecture to start watching 🎥</p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
