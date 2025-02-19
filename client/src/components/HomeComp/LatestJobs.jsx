import React from "react";
import { Assets } from "../../assets/Assets";

function LatestJobs() {
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
    },
    {
      id: 4,
      icon: Assets.microsoftLogo,
      name: "Full Stack Developer",
      country: "Califonia",
      level: "Senior Level",
      description:
        "You will be responsible for frontend and backend development tasks You will work closely with our..",
    },
    {
      id: 5,
      icon: Assets.accentureLogo,
      name: "Full Stack Developer",
      country: "Califonia",
      level: "Senior Level",
      description:
        "You will be responsible for frontend and backend development tasks You will work closely with our..",
    },
    {
      id: 6,
      icon: Assets.walmartLogo,
      name: "Full Stack Developer",
      country: "Califonia",
      level: "Senior Level",
      description:
        "You will be responsible for frontend and backend development tasks You will work closely with our..",
    },
    {
      id: 7,
      icon: Assets.accentureLogo,
      name: "Full Stack Developer",
      country: "Califonia",
      level: "Senior Level",
      description:
        "You will be responsible for frontend and backend development tasks You will work closely with our..",
    },
    {
      id: 8,
      icon: Assets.walmartLogo,
      name: "Full Stack Developer",
      country: "Califonia",
      level: "Senior Level",
      description:
        "You will be responsible for frontend and backend development tasks You will work closely with our..",
    },
    {
      id: 9,
      icon: Assets.microsoftLogo,
      name: "Full Stack Developer",
      country: "Califonia",
      level: "Senior Level",
      description:
        "You will be responsible for frontend and backend development tasks You will work closely with our..",
    },
  ];
  return (
    <div>
      <p className=" text-3xl font-semibold mb-2">Latest Jobs</p>
      <p className=" text-text">Get your desired job from top companies</p>
      <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-16">
        {listing.map((list) => (
          <div className=" py-6 shadow-sm border-[#bdbaba] rounded-lg max-w-[305px] h-80 px-6">
            <img
              src={list.icon}
              alt="company logo"
              className=" max-w-[87px] max-h-[35px]"
            />
            <p className=" font-medium text-lg py-2">{list.name}</p>
            <div className=" space-x-4 my-3">
              <button className="cursor-pointer bg-[#EFF5FF] text-text text-sm rounded-sm border border-[#8BC3FF] py-2 px-4">
                {list.country}
              </button>
              <button className="cursor-pointer bg-[#FFF5F3] text-text text-sm rounded-sm border border-[#FFBABA] py-2 px-4">
                {list.level}
              </button>
            </div>
            <p className=" text-sm text-text pb-3 pt-1">{list.description}</p>

            <div className=" space-x-2">
              <button className=" bg-theme rounded-sm text-white py-2 px-5 text-sm cursor-pointer hover:bg-theme-hover">
                Apply Now
              </button>
              <button className=" cursor-pointer border text-sm rounded-sm py-2 px-5 border-[#bdbaba]">
                Learn more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestJobs;
