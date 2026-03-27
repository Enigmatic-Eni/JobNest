import React, { useRef, useState } from "react";
import { Assets } from "../assets/Assets";
// import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";


function Navbar() {

    const [dropdown, setDropdown] = useState(false);
      const dropdownRef = useRef(null);
    
  const navigate = useNavigate()

   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };


  return (
       <div className="flex items-center justify-between px-6 md:px-16 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src={Assets.logo} alt="Jobnest Logo" className="w-16" />
          <span className="text-2xl font-bold hidden sm:block">Jobnest</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <img
            src={Assets.person}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            onClick={() => setDropdown(!dropdown)}
            onMouseEnter={() => setDropdown(true)}
          />
          <div
            onMouseLeave={() => setDropdown(false)}
            className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${dropdown ? "block" : "hidden"}`}
          >
            <ul className="py-2 text-sm text-gray-700">
                <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/home")}
              >
                Home
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Applied Jobs
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}

export default Navbar;
