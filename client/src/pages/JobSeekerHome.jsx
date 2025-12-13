import React, { useState, useRef, useEffect } from "react";
import { Assets } from "@/assets/Assets";
import { Search, Bookmark } from "lucide-react";
import {motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function JobSeekerHome() {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
const [user, setUser] = useState(null);
const navigate = useNavigate()

useEffect(()=>{
  const storedUser = localStorage.getItem("user");
  if(storedUser){
    setUser(JSON.parse(storedUser));
  }else{
    navigate("/");
  }
}, [navigate])

  const toggleDropdown = (e)=>{
    e.preventDefault();
    setDropdown(!dropdown)
  }

  const handleLogout = () =>{
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate('/')
}


  // const jobs = [
  //   {
  //     id: 1,
  //     icon: Assets.accentureLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 2,
  //     icon: Assets.microsoftLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 3,
  //     icon: Assets.walmartLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 4,
  //     icon: Assets.microsoftLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 5,
  //     icon: Assets.accentureLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 6,
  //     icon: Assets.walmartLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 7,
  //     icon: Assets.accentureLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  //   {
  //     id: 8,
  //     icon: Assets.walmartLogo,
  //     name: "Full Stack Developer",
  //     country: "Califonia",
  //     level: "Senior Level",
  //     description:
  //       "You will be responsible for frontend and backend development tasks You will work closely with our..",
  //   },
  // ];
  return (
    <div>
     
        
          <div className=" flex items-center justify-between px-6 md:px-16 mt-5">

 <div className="Logo flex items-center">
            <div>
              <img src={Assets.logo} alt="JobNest Logo" className="w-16" />
            </div>
            <a href="" className=" text-2xl font-bold hidden sm:block">
              Talength
            </a>
          </div>

            <div className=" flex items-center gap-5">

                <div className="relative" ref={dropdownRef}>
                  <img
                    src={Assets.person}
                    alt="Profile picture"
                    className="w-7 bg-theme rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                    onMouseEnter={() => setDropdown(true)}
                  />

                  <div
                    onMouseLeave={() => setDropdown(false)}
                    className={`dropdown absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg z-10 ${
                      dropdown ? "block" : "hidden"
                    }`}
                  >
                    <ul className=" py-2 text-sm text-gray-700">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>navigate('/profile')}>
                        Profile
                      </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Applied Jobs
                      </li>
                      <li
                        className="
   px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}>
                        Logout
                      </li>
                    </ul>
                  </div>
                </div>
           
            </div>
       
        </div>

    <div className="px-6 md:px-16 py-8 space-y-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              Hey {user?.fullName?.split(" ")[0] || "there"}
            </h1>
            <p className="text-gray-400 text-lg">
              Here are the best jobs we found for you today.
            </p>
          </motion.div>


        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-200 max-w-3xl">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for jobs..."
            className="flex-1 outline-none text-gray-500"
          />
          <button className="bg-theme hover:bg-theme-hover text-white px-6 py-2 rounded-xl font-medium">
            Search
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-3">Filters</h2>
              <label className="block text-sm text-gray-600 mb-2">
                Location
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-theme">
                <option>Nigeria</option>
                <option>Serbia</option>
                <option>Canada</option>
              </select>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-3">Category</h2>
              {["Development", "Design", "Data Science", "QA"].map((cat) => (
                <div key={cat} className="flex items-center gap-2 mb-2">
                  <input type="checkbox" id={cat} />
                  <label htmlFor={cat}>{cat}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all mb-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">FullStack Developer</h3>
                  <Bookmark className="text-gray-400 hover:text-theme cursor-pointer" />
                </div>
                <div className="flex  items-center gap-3">
                  <img src={Assets.slackLogo} height={30} width={30} className="" alt="" />
                <p className="text-sm text-gray-500 mb-3">Accenture • Lagos</p>
                </div>
                <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                  Join our development team and help build scalable solutions
                  for enterprise clients.
                </p>
                <div className="flex gap-3">
                  <button className="bg-theme text-white px-4 py-2 rounded-lg text-sm hover:bg-theme-hover transition-all">
                    Apply Now
                  </button>
                  <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
                    Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div>
            <h2 className=" font-semibold text-xl mb-4">Your Saved Jobs</h2>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200 space-y-4">
              {["UI Designer", "Backend Developer", "QA Engineer"].map(
                (title) => (
                  <div className="flex justify-between border-b pb-2 last:border-none">
                    <p className="font-medium">{title}</p>
                    <p className="text-gray-500 text-sm">Microsoft</p>
                    <button className="text-theme text-sm font-medium">
                      View
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-4">Quick Tips</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-3">
              <p className="text-gray-600 text-sm">
                💡 Update your resume every 3 months to keep it fresh.
              </p>
              <p className="text-gray-600 text-sm">
                🔍 Tailor your cover letter to each job.
              </p>
              <p className="text-gray-600 text-sm">
                🎯 Follow companies you're interested in to get alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
}
