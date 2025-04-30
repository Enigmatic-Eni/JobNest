import React from 'react'
import { Assets } from "../../assets/Assets";

function MoreJobs() {
    const listing = [
        {
          id: 1,
          icon: Assets.accentureLogo,
          name: "Full Stack Developer",
          country: "Califonia",
          level: "Senior Level",
          description:
            "You will be responsible for frontend and backend development tasks You will work closely with our..",
        },
        {
          id: 2,
          icon: Assets.microsoftLogo,
          name: "Full Stack Developer",
          country: "Califonia",
          level: "Senior Level",
          description:
            "You will be responsible for frontend and backend development tasks You will work closely with our..",
        },
        {
          id: 3,
          icon: Assets.walmartLogo,
          name: "Full Stack Developer",
          country: "Califonia",
          level: "Senior Level",
          description:
            "You will be responsible for frontend and backend development tasks You will work closely with our..",
        }
    ]
  return (
    <div>
        <p className=" pb-4">More Jobs from Slack</p>
        <div className=' '>
        {listing.map((list) => (
          <div className=" py-6 shadow-sm border-[#bdbaba] rounded-lg max-w-[305px] h-[325px] px-6 mb-5">
            <img
              src={list.icon}
              alt="company logo"
              className=" max-w-[87px] max-h-[35px]"
            />
            <p className=" font-medium text-lg py-2">{list.name}</p>
            <div className=" space-x-3 my-3">
              <button className="cursor-pointer bg-[#EFF5FF] text-text text-sm rounded-sm border border-[#8BC3FF] py-2 px-3">
                {list.country}
              </button>
              <button className="cursor-pointer bg-[#FFF5F3] text-text text-sm rounded-sm border border-[#FFBABA] py-2 px-3">
                {list.level}
              </button>
            </div>
            <p className=" text-sm text-text pb-3 pt-1">{list.description}</p>

            <div className=" space-x-2">
              <button className=" bg-theme rounded-sm text-white py-2 px-4 text-sm cursor-pointer hover:bg-theme-hover">
                Apply Now
              </button>
              <button className=" cursor-pointer border text-sm rounded-sm py-2 px-4 border-[#bdbaba]">
                Learn more
              </button>
            </div>
          </div>
        ))}

        </div>
    </div>
  )
}

export default MoreJobs