import API from '../lib/api'


export const fetchJobs = async ({keyword, location, source, page, limit}) =>{
    const params = new URLSearchParams();

    if(keyword) params.append("keyword", keyword);
    if(location) params.append("location", location);
    if(source) params.append("source", source);
    if(page) params.append("page", page);
    if(limit) params.append("limit", limit);

    const res = await API.get(`/jobs?${params.toString()}`);
    return res.data
};

export const fetchJobById = async (id)=>{
    const res = await API.get(`/jobs/${id}`);
    return res.data;
}
