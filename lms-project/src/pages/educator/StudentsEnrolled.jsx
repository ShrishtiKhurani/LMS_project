import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../student/Loading";
const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);
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
              <th className="py-3 px-6">Student</th>
              <th className="py-3 px-6">Student Name</th>
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

                {/* Student Image */}
                <td className="py-4 px-6">
                  <img
                    src={item.student.imageUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border shadow-sm"
                  />
                </td>

                {/* Student Name */}
                <td className="py-4 px-6 font-medium text-gray-800">
                  {item.student.name}
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
