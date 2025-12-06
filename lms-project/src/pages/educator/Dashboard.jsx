import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'

const Dashboard = () => {

  const {currency}=useContext(AppContext)
  const [dashboardData, setDashboardData]=useState(null)

  const fetchDashboardData= async ()=>{
    setDashboardData(dummyDashboardData)
  }

  useEffect(()=>{
    fetchDashboardData()
  },[])
  return dashboardData ? (
  <div className="w-full p-4 sm:p-6">

    {/* Cards Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* Card 1 */}
      <div className="flex items-center gap-3 bg-white border rounded-2xl px-5 py-6 
                      hover:shadow-lg transition-all">
        <div className="p-2 rounded-md bg-blue-100">
          <img src={assets.patients_icon} alt="" className="w-8" />
        </div>
        <div>
          <p className="text-xl font-semibold">
            {dashboardData.enrolledStudentsData.length}
          </p>
          <p className="text-md text-gray-500">Total Enrolments</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex items-center gap-3 bg-white border rounded-2xl px-5 py-6 
                     hover:shadow-lg transition-all">
        <div className="p-2 rounded-md bg-green-100">
          <img src={assets.appointments_icon} alt="" className="w-8" />
        </div>
        <div>
          <p className="text-xl font-semibold">{dashboardData.totalCourses}</p>
          <p className="text-md text-gray-500">Total Courses</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex items-center gap-3 bg-white border rounded-2xl px-5 py-6 
                     hover:shadow-lg transition-all">
        <div className="p-2 rounded-md bg-yellow-100">
          <img src={assets.earning_icon} alt="" className="w-8" />
        </div>
        <div>
          <p className="text-xl font-semibold">
            {currency}{dashboardData.totalEarnings}
          </p>
          <p className="text-md text-gray-500">Total Earnings</p>
        </div>
      </div>

    </div>

    {/* Latest Enrollments */}
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-5">
        Latest Enrollments
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-md border-separate border-spacing-y-1 min-w-[600px]">
          <thead>
            <tr>
              <th className="pb-1 px-6 text-left text-gray-500 font-medium">S.No</th>
              <th className="pb-1 px-6 text-left text-gray-500 font-medium">Student name</th>
              <th className="pb-1 px-10 text-left text-gray-500 font-medium">Course Title</th>
            </tr>
          </thead>

          <tbody>
            {dashboardData.enrolledStudentsData.map((item, index) => (
              <tr key={index} className="bg-white shadow-sm rounded-xl">
                <td className="py-4 px-6 rounded-l-xl text-gray-700">
                  {index + 1}
                </td>

                <td className="py-4 px-6 flex items-center gap-4 text-gray-700">
                  <img
                    src={item.student.imageUrl}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="font-medium">{item.student.name}</span>
                </td>

                <td className="py-4 px-10 rounded-r-xl text-gray-700">
                  {item.courseTitle}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
) : (
  <Loading />
);

  <Loading/>
}

export default Dashboard
