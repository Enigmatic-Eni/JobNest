import React from "react";
import { Assets } from "../../assets/Assets";
import { GoBriefcase } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { GrMoney } from "react-icons/gr";

function JobDetails() {
  return (
    <div className=" flex  bg-[#F2F7FF] justify-between border-theme border rounded-lg items-center py-14 px-10">
      <div className=" flex items-center">
        <div className=" bg-white py-8 px-7 rounded-lg">
          <img src={Assets.slackLogo} alt="" />
        </div>
        <div className=" ml-6">
          <p className=" text-3xl font-medium mb-3.5">Full Stack Developer</p>
          <div className=" grid grid-cols-4 gap-4">
            <div className=" flex items-center gap-2">
              <GoBriefcase />
              <p>Slack</p>
            </div>
            <div className=" flex items-center gap-2">
              <IoLocationOutline />
              <p>Califonia</p>
            </div>
            <div className=" flex items-center gap-2">
              <GoPerson />
              <p>Mid level</p>
            </div>
            <div className=" flex items-center gap-2">
              <GrMoney />
              <p>CTC: $80</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button className=" bg-theme hover:bg-theme-hover px-10 py-2.5 text-white rounded-md cursor-pointer mb-3.5">
          Apply now
        </button>
        <p className=" text-sm ">Posted 25 minutes ago</p>
      </div>
    </div>
  );
}

export default JobDetails;
