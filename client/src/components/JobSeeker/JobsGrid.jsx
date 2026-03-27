import React from "react";
import JobCard from "./JobCard";
import { Loader2 } from "lucide-react";

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="w-16 h-4 bg-gray-200 rounded-full" />
    </div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
    <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
    <div className="flex gap-2">
      <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
      <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

export default function JobsGrid({ jobs, loading, error }) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-lg font-medium">No jobs found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobCard key={job._id} job={job} index={index} />
      ))}
    </div>
  );
}