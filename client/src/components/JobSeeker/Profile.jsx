import React from "react";
import Navbar from "../Navbar";
import { PenLine } from "lucide-react";

export default function Profile() {
  return (
    <div className="px-5">
      <Navbar />
      <div className="px-15">
        <p className=" pb-3 text-xl font-semibold">My Profile</p>

        <div className=" mb-4 flex justify-between border rounded-lg p-5 border-gray-100 shadow-sm items-center">
          <div className="">
            <p className=" pb-1 text-lg font-medium">Rauf Sharma</p>
            <p className=" pb-1 text-[14px] text-gray-400">Team Manager</p>
            <p className=" text-[12px] text-gray-400">Lagos, Nigeria</p>
          </div>

          <div className="flex gap-2 hover:cursor-pointer items-center p-2 rounded-3xl border border-gray-200 text-gray-400 text-sm">
            <p>Edit</p>
            <PenLine className=" w-3" />
          </div>
        </div>

        <div className=" mb-4 border rounded-lg p-5 border-gray-100 shadow-sm items-center">
        
            <div className=" flex items-center justify-between">
              <div>
                <p className=" pb-1 text-lg font-medium">
                  Personal Information
                </p>
              </div>
              <div className="flex gap-2 hover:cursor-pointer items-center p-2 rounded-3xl border border-gray-200 text-gray-400 text-sm">
                <p>Edit</p>
                <PenLine className=" w-3" />
              </div>
            </div>

            <div className=" grid grid-cols-2 gap-2">
              <div>
                <p className=" text-[12px] text-gray-400">First Name</p>
                <p className=" pb-1 text-[14px] ">Rauf</p>
              </div>

              <div>
                <p className=" text-[12px] text-gray-400">Last Name</p>
                <p className=" pb-1 text-[14px]">Sharma</p>
              </div>

                <div>
                <p className=" text-[12px] text-gray-400">Email Address</p>
                <p className=" pb-1 text-[14px]">rauf@gmail.com</p>
              </div>

                <div>
                <p className=" text-[12px] text-gray-400">Phone</p>
                <p className=" pb-1 text-[14px]">+2348146397327</p>
              </div>

                <div>
                <p className=" text-[12px] text-gray-400">Bio</p>
                <p className=" pb-1 text-[14px]">Team Manager</p>
              </div>
            </div>
        </div>

 <div className="  border rounded-lg p-5 border-gray-100 shadow-sm items-center">
        
            <div className=" flex items-center justify-between">
              <div>
                <p className=" pb-1 text-lg font-medium">
                  Personal Information
                </p>
              </div>
              <div className="flex gap-2 hover:cursor-pointer items-center p-2 rounded-3xl border border-gray-200 text-gray-400 text-sm">
                <p>Edit</p>
                <PenLine className=" w-3" />
              </div>
            </div>

            <div className=" grid grid-cols-2 gap-2">
              <div>
                <p className=" text-[12px] text-gray-400">First Name</p>
                <p className=" pb-1 text-[14px] ">Rauf</p>
              </div>

              <div>
                <p className=" text-[12px] text-gray-400">Last Name</p>
                <p className=" pb-1 text-[14px]">Sharma</p>
              </div>

                <div>
                <p className=" text-[12px] text-gray-400">Email Address</p>
                <p className=" pb-1 text-[14px]">rauf@gmail.com</p>
              </div>

                <div>
                <p className=" text-[12px] text-gray-400">Phone</p>
                <p className=" pb-1 text-[14px]">+2348146397327</p>
              </div>

                <div>
                <p className=" text-[12px] text-gray-400">Bio</p>
                <p className=" pb-1 text-[14px]">Team Manager</p>
              </div>
            </div>
     </div>

      </div>
    </div>
  );
}
