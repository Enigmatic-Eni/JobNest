import { useState, useCallback, useEffect } from "react";
import { fetchJobs } from "@/services/jobService";

export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ null not ""

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    source: "",
    page: 1,
    limit: 20
  });

  // ✅ FIXED: Stable loadJobs - NO deps
  const loadJobs = useCallback(async (overrideFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters, ...overrideFilters };
      // console.log("🔍 API CALL:", params);
      
      const data = await fetchJobs(params);
      setJobs(data.jobs || []);
      setPagination(data.pagination);
    } catch (err) {
      console.error("❌ API ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filters]); // ✅ Only filters dep

  // ✅ STABLE: No infinite loop
  const updateFilters = useCallback((newFilters) => {
    // console.log("🔄 Update filters:", newFilters);
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    loadJobs(updated);
  }, [filters, loadJobs]);

  const changePage = useCallback((page) => {
    const updated = { ...filters, page };
    setFilters(updated);
    loadJobs(updated);
  }, [filters, loadJobs]);

  // ✅ Load once on mount
  useEffect(() => {
    loadJobs();
  }, []);

  return {
    jobs,
    pagination,
    loading,
    error,
    filters,
    loadJobs,
    updateFilters,
    changePage
  };
}