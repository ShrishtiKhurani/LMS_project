import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'

const MyCourse = () => {

  const {currency, allCourses}= useContext(AppContext)
  const [courses , setCourses]= useState(null)

  const fetchEducatorCourses =async ()=>{
    setCourses(allCourses)
  }

  useEffect(()=>{
    fetchEducatorCourses()
  },[])

  return courses? (
<div className="w-full mt-6">

  {/* Heading */}
  <h2 className="text-xl font-semibold mb-4 text-gray-800">My Courses</h2>

  {/* Table Wrapper */}
  <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
    <table className="min-w-full text-md">
      
      {/* Table Head */}
      <thead className="bg-gray-100 text-gray-700 text-left">
        <tr>
          <th className="py-3 px-6 font-medium">All Courses</th>
          <th className="py-3 px-6 font-medium">Earning</th>
          <th className="py-3 px-6 font-medium">Students</th>
          <th className="py-3 px-6 font-medium">Published On</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {courses.map((course) => (
          <tr
            key={course._id}
            className="border-b hover:bg-gray-50 transition-all"
          >
            {/* Thumbnail + Title */}
            <td className="py-4 px-6">
              <div className="flex items-center gap-4">
                <img
                  src={course.courseThumbnail}
                  alt="course img"
                  className="w-12 h-12 object-cover rounded-lg shadow-sm"
                />
                <span className="font-medium text-gray-800">
                  {course.courseTitle}
                </span>
              </div>
            </td>

            {/* Earnings */}
            <td className="py-4 px-6 font-medium text-gray-700">
              {currency}
              {Math.floor(
                course.enrolledStudents.length *
                  (course.coursePrice -
                    (course.discount * course.coursePrice) / 100)
              )}
            </td>

            {/* Student Count */}
            <td className="py-4 px-6 text-gray-700">
              {course.enrolledStudents.length}
            </td>

            {/* Published Date */}
            <td className="py-4 px-6 text-gray-700">
              {new Date(course.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  ):
  <Loading/>
}

export default MyCourse
