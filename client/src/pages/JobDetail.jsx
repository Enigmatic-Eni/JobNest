import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobsById } from "@/services/jobService";
import API from "@/lib/api";
import {
  MapPin,
  Building2,
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  Download,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// ---- Shows download link after successful generation ----
const DownloadLink = ({ label, docxUrl }) => (
  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
    <div className="flex items-center gap-2 mb-3">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <p className="text-sm font-medium text-green-800">
        {label} generated successfully
      </p>
    </div>
    <a
      href={docxUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-xs hover:bg-green-50 transition-all w-fit">
      <Download className="w-3 h-3" />
      Download DOCX
    </a>
  </div>
);

// ---- Button with loading spinner ----
const GenerateButton = ({ onClick, loading, label }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading
      ? <Loader2 className="w-4 h-4 animate-spin" />
      : <FileText className="w-4 h-4" />
    }
    {loading ? "Generating..." : label}
  </button>
);

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Job loading state
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CV generation state
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cvResult, setCvResult] = useState(null);

  // Cover letter generation state
  const [clLoading, setClLoading] = useState(false);
  const [clError, setClError] = useState("");
  const [clResult, setClResult] = useState(null);


 // Load job details AND check for existing generated docs
useEffect(() => {
  const load = async () => {
    try {
      // Fetch job details and existing generated docs at the same time
      const [jobData, docsData] = await Promise.all([
        fetchJobsById(id),
        API.get(`/ai/generated-docs/${id}`)
      ]);

      setJob(jobData.job);

      // If user already generated a CV for this job, show download button immediately
      if (docsData.data.cv) {
        setCvResult(docsData.data.cv);
      }

      // If user already generated a cover letter, show download button immediately
      if (docsData.data.coverLetter) {
        setClResult(docsData.data.coverLetter);
      }

    } catch (err) {
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [id]);

  // Called when user clicks Generate Tailored CV
  const handleGenerateCV = async () => {
    setCvLoading(true);
    setCvError("");
    setCvResult(null);

    try {
      const res = await API.post(`/ai/generate-cv/${id}`);
      setCvResult(res.data.cv); // { docxUrl }
    } catch (err) {
      setCvError(err.response?.data?.message || "Failed to generate CV");
    } finally {
      setCvLoading(false);
    }
  };

  // Called when user clicks Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    setClLoading(true);
    setClError("");
    setClResult(null);

    try {
      const res = await API.post(`/ai/generate-cover-letter/${id}`);
      setClResult(res.data.coverLetter); // { docxUrl }
    } catch (err) {
      setClError(err.response?.data?.message || "Failed to generate cover letter");
    } finally {
      setClLoading(false);
    }
  };

  // Loading spinner while job details fetch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error || "Job not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-16 py-8 max-w-4xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">

        {/* Job header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {job.title}
            </h1>
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
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all text-sm font-medium">
  
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* AI generation section */}
        <div className="border border-gray-100 rounded-xl p-5 mb-6 bg-gray-50">
          <h2 className="font-semibold text-gray-800 mb-1">
            AI-Powered Application Documents
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Generate a tailored CV and cover letter for this specific role.
            Your uploaded CV is used as the base — nothing is invented.
          </p>

          {/* Generate buttons */}
          <div className="flex flex-wrap gap-3">
            <GenerateButton
              onClick={handleGenerateCV}
              loading={cvLoading}
              label="Generate Tailored CV"
            />
            <GenerateButton
              onClick={handleGenerateCoverLetter}
              loading={clLoading}
              label="Generate Cover Letter"
            />
          </div>

          {/* CV result or error */}
          {cvError && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {cvError}
            </div>
          )}
          {cvResult && (
            <DownloadLink label="Tailored CV" docxUrl={cvResult.docxUrl} />
          )}

          {/* Cover letter result or error */}
          {clError && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {clError}
            </div>
          )}
          {clResult && (
            <DownloadLink label="Cover Letter" docxUrl={clResult.docxUrl} />
          )}
        </div>

        {/* Job description */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-semibold text-lg mb-4">Job Description</h2>
          {job.description ? (
            <div
              className="text-gray-600 text-sm leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          ) : (
            <p className="text-gray-400 text-sm">
              No description available. Click Apply Now to view full details
              on the company website.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}