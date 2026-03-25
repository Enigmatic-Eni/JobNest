import React from 'react'


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

export default function JobCard() {


  return (
    <div></div>
  )
}
