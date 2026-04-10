import React, { useState, useRef, useEffect } from "react";
import { Assets } from "@/assets/Assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useJobs from "@/hooks/useJobs";
import SearchBar from "@/components/JobSeeker/SearchBar";
import JobFilters from "@/components/JobSeeker/JobFilters";
import JobsGrid from "@/components/JobSeeker/JobsGrid";
import Pagination from "@/components/JobSeeker/Pagination";
import Navbar from "@/components/Navbar";

export default function JobSeekerHome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const {
    jobs,
    pagination,
    loading,
    error,
    loadJobs,
    updateFilters,
    changePage,
  } = useJobs();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }

    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    // Use preferred job titles first, fall back to skills, then load all
    const jobTitles = parsed?.jobSeekerInfo?.preferences?.jobTitles || [];
    const skills = parsed?.jobSeekerInfo?.skills || [];

    if (jobTitles.length > 0) {
      loadJobs({ keyword: jobTitles[0] });
    } else if (skills.length > 0) {
      loadJobs({ keyword: skills[0] });
    } else {
      loadJobs();
    }
  }, [navigate]);

  // Load jobs on mount
  // useEffect(() => {
  //   loadJobs();
  // }, []);

  const handleSearch = (keyword) => {
    // console.log("🔍 Search triggered:", keyword);
    updateFilters({ keyword });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  return (
   <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 md:px-16 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Hey {user?.fullName?.split(" ")[0] || "there"} 
          </h1>
          <p className="text-gray-400 text-lg mt-1">
            Here are the best jobs we found for you today.
          </p>

          {/* Preferred job title tags */}
          {user?.jobSeekerInfo?.preferences?.jobTitles?.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-sm text-gray-500">Job titles:</span>
              {user.jobSeekerInfo.preferences.jobTitles.map((title) => (
                <span
                  key={title}
                  onClick={() => updateFilters({ keyword: title })}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full cursor-pointer hover:bg-blue-200 transition-all"
                >
                  {title}
                </span>
              ))}
            </div>
          )}

          {/* Skills tags */}
          {user?.jobSeekerInfo?.skills?.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-sm text-gray-500">Skills:</span>
              {user.jobSeekerInfo.skills.map((skill) => (
                <span
                  key={skill}
                  onClick={() => updateFilters({ keyword: skill })}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200 transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* Filters sidebar */}
          <div className="md:w-1/4">
            <JobFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Jobs + Pagination */}
          <div className="md:w-3/4">
            <JobsGrid jobs={jobs} loading={loading} error={error} />
            <Pagination pagination={pagination} onPageChange={changePage} />
          </div>

        </div>
      </div>
    </div>
  );
}
