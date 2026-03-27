import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin } from 'lucide-react';


const CompanyAvatar = ({name}) =>{
    const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0,2)
    .join("")
    .toUpperCase() || "?"

    return (
    <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm'>
        {initials}
    </div>
)
}

const SourceBadge = ({ source }) => {
  const colors = {
    greenhouse: "bg-green-100 text-green-700 border-green-200",
    arbeitnow: "bg-purple-100 text-purple-700 border-purple-200",
    remotive: "bg-orange-100 text-orange-700 border-orange-200"
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[source] || "bg-gray-100 text-gray-600"}`}>
      {source}
    </span>
  );
};

export default function JobCard({job, index}) {
  const navigate = useNavigate()

  return (
    <motion.div initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y:0}}
    transition={{delay: index*0.05}}
    className='bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between'>
      <div>
        <div className='flex items-start justify-between mb-3'>
          <CompanyAvatar name ={job.company}/>
          <SourceBadge source = {job.source}/>
        </div>
      
      
      <h3 className="font-semibold text-gray-800 text-[15px] leading-snug mb-1 line-clamp-2">{job.title}</h3>
         <div className="flex items-center gap-1 text-gray-500 text-[12px] mb-1">
          <Building2 className="w-3 h-3" />
          <span>{job.company}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-[12px] mb-3">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{job.location}</span>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/job/${job._id}`)}
          className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-[12px] hover:bg-gray-50 transition-all"
        >
          Details
        </button>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-theme text-white px-3 py-2 rounded-lg text-[12px] hover:bg-theme-hover transition-all text-center"
        >
          Apply Now
        </a>
      </div>
    </motion.div>
  )
}
