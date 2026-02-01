import React, { useContext, useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../student/Loading";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);

  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + `/api/educator/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  useEffect(() => {
  console.log(enrolledStudents);
}, [enrolledStudents]);


  return enrolledStudents ? (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Student Enrollments
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="py-3 px-6">S.No</th>
              <th className="py-3 px-6">Student Name</th>
              <th className="py-3 px-6">Course Title</th>
              <th className="py-3 px-6">Date</th>
            </tr>
          </thead>

          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="py-4 px-6">{index + 1}</td>

                {/* Student Image and Student Image   */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.student?.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border shadow-sm"
                    />
                    <span className="font-medium text-gray-800">
                      {item.student?.name}
                    </span>
                  </div>
                </td>

                {/* Course title */}
                <td className="py-4 px-6 font-medium text-gray-800">
                  {item.courseTitle || "N/A"}
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-gray-700">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
