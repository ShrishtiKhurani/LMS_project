import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  // Become Educator
  const becomeEducator = async () => {
    try {
      if (!user) return toast.error("Please login first");
      if (isEducator) {
        navigate("/educator");
        return;
      }

      // Confirm dialog before upgrading
      const confirmEducator = window.confirm(
        "Do you want to become an Educator? This will allow you to publish courses."
      );
      if (!confirmEducator) return;

      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* large screen*/}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        {user ? (
          <>
            <div className="flex items-center gap-5">
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <span>|</span>
              <Link to="/my-enrollment" className="hover:text-gray-800 transition">
                My Enrollments
              </Link>
            </div>
            <UserButton />
          </>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-full shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        {user ? (
          <>
            <div className="flex flex-col gap-1 sm:gap-2 text-sm">
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to="/my-enrollment" className="hover:text-gray-800 transition">
                My Enrollments
              </Link>
            </div>
            <UserButton />
          </>
        ) : (
          <button className="p-1 sm:p-2 rounded-full transition" onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="user icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
