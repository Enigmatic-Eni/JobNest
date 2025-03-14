import React from "react";
import { Assets } from "../../assets/Assets";
import { GoBriefcase } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { GrMoney } from "react-icons/gr";
import { Button } from "../ui/button";

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
        <Button variant="base" size="xl">Apply Now</Button>
        <p className="mt-3.5 text-sm ">Posted 25 minutes ago</p>
      </div>
    </div>
  );
}

export default JobDetails;
