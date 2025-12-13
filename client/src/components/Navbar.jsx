import React from "react";
import { Assets } from "../assets/Assets";
// import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () =>{
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate('/')
}


  return (
    <div className=" flex items-center justify-between py-6 ">
      <div className="Logo flex items-center">
        <div>
          <img src={Assets.logo} alt="JobNest Logo" className="w-16" />
        </div>
        <a href="" className=" text-2xl font-bold hidden sm:block">
          JobNest
        </a>
      </div>


        <div>
        <span className="bg-theme text-white rounded-4xl hover:bg-theme-hover px-7 py-2 text-base cursor-pointer" onClick={handleLogout}>
                Logout
              </span>
        </div>
      </div>
  );
}

export default Navbar;
