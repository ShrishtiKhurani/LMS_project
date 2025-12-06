import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { NavLink } from 'react-router-dom';

const SideBar = () => {

  const isEducator = useContext(AppContext);

  const dashboardItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Course', path: '/educator/my-course', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className="w-56 min-h-screen bg-white border-r flex flex-col py-6 gap-2">
      
      {dashboardItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/educator'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-lg transition-all 
            ${isActive ? "bg-blue-50 text-blue-600 border-r-4 border-blue-500" :
              "text-gray-700 hover:bg-gray-100"}`
          }
        >
          <img src={item.icon} alt="" className="w-5 h-5 opacity-80" />
          <p>{item.name}</p>
        </NavLink>
      ))}

    </div>
  )
}

export default SideBar
