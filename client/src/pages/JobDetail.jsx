import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobsById } from "@/services/jobService";
import { MapPin, Building2, ArrowLeft, ExternalLink } from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJobsById(id);
        setJob(data.job);
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00519a]" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error || "Job not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-8 max-w-4xl mx-auto">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            </div>
          </div>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-theme text-white px-6 py-3 rounded-xl hover:bg-theme-hover transition-all text-sm font-medium"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Description */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-semibold text-lg mb-4">Job Description</h2>
          {job.description ? (
            <div
              className="text-gray-600 text-sm leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          ) : (
            <p className="text-gray-400 text-sm">
              No description available. Click Apply Now to view full details on the company's website.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
