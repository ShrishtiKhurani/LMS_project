import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
const NavBar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-6 py-3 sm:px-8 sm:py-4 bg-white shadow-sm border-b">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className="w-28 lg:w-32 cursor-pointer hover:opacity-90 transition"
        />
      </Link>

      {/* Right Content */}
      <div className="px-6 sm:px-8 flex items-center gap-3 sm:gap-4">
        <p className="text-sm sm:text-base font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-xl shadow-sm">
          Hi !{"  "}
          <span className="text-blue-400">
            {user ? user.fullName : "Developers"}
          </span>
        </p>

        {user ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10",
                userButtonAvatarImage: "w-10 h-10",
              },
            }}
          />
        ) : (
          <img
            className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
            src={assets.profile_img}
            alt="profile"
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
