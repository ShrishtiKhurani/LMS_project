import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const MyEnrollments = () => {
  const {
    enrolledCourse,
    calculateCourseDuration,
    navigate,
    backendUrl,
    userData,
    getToken,
    fetchUserEnrolledCourses,
    calculateTotalLecturs,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourse.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          let totalLectures = calculateTotalLecturs(course);
          let lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;

          return { totalLectures, lectureCompleted };
        })
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourse.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourse]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-24">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          My Enrollments
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base text-gray-700">
            <thead className="bg-gray-100 text-gray-800 uppercase text-xs md:text-sm">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Course
                </th>
                <th></th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Duration
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Completed
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {enrolledCourse.map((course, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 md:px-6 py-4 flex items-center gap-4">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-16 h-16 sm:w-24 md:w-32 md:h-20 rounded-md object-cover"
                    />
                  </td>
                  <td>
                    <p className="font-medium text-gray-800">
                      {course.courseTitle}
                    </p>

                    {/* for progress bar.. */}
                    <Line
                      strokeWidth={2}
                      percent={
                        progressArray[index]
                          ? (progressArray[index].lectureCompleted * 100) /
                            progressArray[index].totalLectures
                          : 0
                      }
                      strokeColor={
                        progressArray[index] &&
                        progressArray[index].lectureCompleted /
                          progressArray[index].totalLectures ===
                          1
                          ? "#16a34a"
                          : "#3b82f6"
                      }
                      trailColor="#f3f4f6"
                      strokeLinecap="round"
                    />
                  </td>

                  <td className="px-4 md:px-6 py-4">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="px-4 md:px-6 py-4">
                    {progressArray[index] &&
                      `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}
                    <span className="text-gray-500 text-sm"> Lectures</span>
                  </td>

                  <td className="px-4 md:px-6 py-4">
                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className={`px-3 py-1 text-sm font-medium rounded-md  ${
                        progressArray[index] &&
                        progressArray[index].lectureCompleted /
                          progressArray[index].totalLectures ===
                          1
                          ? "text-green-600 font-semibold"
                          : "text-orange-500 font-semibold"
                      }`}
                    >
                      {progressArray[index] &&
                      progressArray[index].lectureCompleted /
                        progressArray[index].totalLectures ===
                        1
                        ? "Completed "
                        : "On Going"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
