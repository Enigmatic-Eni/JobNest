import React from "react";
import { Assets } from "../../assets/Assets";
import { Button } from "../ui/button";

function Jobs() {
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
    // {
    //   id: 9,
    //   icon: Assets.microsoftLogo,
    //   name: "Full Stack Developer",
    //   country: "Califonia",
    //   level: "Senior Level",
    //   description:
    //     "You will be responsible for frontend and backend development tasks You will work closely with our..",
    // },
    // {
    //   id: 10,
    //   icon: Assets.walmartLogo,
    //   name: "Full Stack Developer",
    //   country: "Califonia",
    //   level: "Senior Level",
    //   description:
    //     "You will be responsible for frontend and backend development tasks You will work closely with our..",
    // },
    // {
    //   id: 11,
    //   icon: Assets.microsoftLogo,
    //   name: "Full Stack Developer",
    //   country: "Califonia",
    //   level: "Senior Level",
    //   description:
    //     "You will be responsible for frontend and backend development tasks You will work closely with our..",
    // },
    // {
    //   id: 12,
    //   icon: Assets.accentureLogo,
    //   name: "Full Stack Developer",
    //   country: "Califonia",
    //   level: "Senior Level",
    //   description:
    //     "You will be responsible for frontend and backend development tasks You will work closely with our..",
    // },
  ];
  return (
    <div className=" ml-2.5">
      <p className="text-3xl font-semibold mb-2">Latest Jobs</p>
      <p className=" text-text">Get your desired job from top companies</p>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-16">
        {listing.map((list) => (
          <div key={list.id} className=" py-6 shadow-sm border-[#bdbaba] rounded-lg max-w-[315px] h-[325px] px-6">
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
              
              <Button variant="base" size="lg">Apply Now</Button>
              <Button variant='outline' size="lg" className="text-sm">Learn more</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
