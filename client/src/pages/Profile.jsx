import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { motion } from "framer-motion";

export default function Profile() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(()=>{
  const fetchProfile = async () =>{
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if(!token || !storedUser){
        navigate("/login");
return;
      }
      const userObj = JSON.parse(storedUser);
      const userId = userObj.id;

      const res = await API.get(`/profile/${userId}`, {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });

      setUser(res.data.user || res.data)
    } catch (error) {
      console.error("Error fetching profile, " , error);
      setError("Failed to load profile");
    }finally{
      setLoading(false);
    }
  }
  fetchProfile();
}, [navigate])

const fadeUp = {
  hidden: {opacity: 0, y: 30},
  visible: {opacity: 1, y: 0}
}

  return (
    <motion.div 
    className="px-5 pb-10 min-h-screen bg-linear-to-br from-white via-gray-50 to-gray-100"
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.6}}>
      <Navbar />

      <motion.div className="px-5 md:px-16 mt-6"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{duration: 0.5}}>
        <p className=" pb-3 text-2xl font-bold text-gray-800">My Profile</p>

        <motion.div className=" mb-4 flex flex-col  md:flex-row md:justify-between border rounded-2xl p-6 shadow-md bg-white border-gray-100 items-center hover:shadow-lg transition-all"
        variants={fadeUp}
        transition={{delay: 0.1}}>
          <div className="">
            <p className=" pb-1 text-xl font-medium">{user?.fullName}</p>
            <p className=" pb-1 text-[14px] text-gray-500">{user?.skills}</p>
            <p className=" text-[12px] text-gray-400">{user?.location}</p>
          </div>

          <motion.div className="flex gap-2 hover:cursor-pointer items-center p-2 rounded-3xl border border-gray-200 text-gray-400 text-sm">
            <p>Edit</p>
            <PenLine className=" w-3" />
          </motion.div>
        </motion.div>

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

      </motion.div>
    </motion.div>
  );
}
