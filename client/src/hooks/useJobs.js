import { fetchJobs } from "@/services/jobService";
import { useCallback, useState } from "react";

import React from 'react'


export default function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        source: "",
        limit: 20,
        page: 1
    });

    const loadJobs = useCallback(async(overrideFilters = {})=>{
        setLoading(true);
        setError("");

        try{
            const activeFilters = {...filters, ...overrideFilters};
            const data = await fetchJobs(activeFilters);
            setJobs(data.jobs);
            setPagination(data.pagination);
        }catch(err){
            setError("Failed to load jobs. Please try again.");
        }finally{
            setLoading(false);
        }
    }, [filters])

    const updateFilters= (newFilters) =>{
        const updated ={...filters, ...newFilters, page: 1};
        setFilters(updated);
        loadJobs(updated);
    };

  return{
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
