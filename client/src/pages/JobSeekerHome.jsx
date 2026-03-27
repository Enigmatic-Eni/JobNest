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
    changePage
  } = useJobs();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);



  const handleSearch = (keyword) => {
    // console.log("🔍 Search triggered:", keyword);
    updateFilters({ keyword });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
<Navbar/>

      <div className="px-6 md:px-16 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Hey {user?.fullName?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-gray-400 text-lg mt-1">
            Here are the best jobs we found for you today.
          </p>
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