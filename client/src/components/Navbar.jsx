import React from "react";
import { Assets } from "../assets/Assets";
// import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruiterSignIn from "./SignIn/RecruiterSignIn";
import RecruiterSignUp from "./SignUp/RecruiterSignUp";
import JobSeekerSignUp from "./SignUp/JobSeekerSIgnUp";
import JobSeekerSignIn from "./SignIn/JobSeekerSignIn";

function Navbar() {
  // const navigate = useNavigate()
  return (
    <div className=" flex items-center justify-between py-6 ">
      <div className="Logo flex items-center">
        <div>
          <img src={Assets.logo} alt="JobNest Logo" className=" md:w-16" />
        </div>
        <a href="" className=" text-2xl font-bold">
          JobNest
        </a>
      </div>

      <div className="login-button flex items-center space-x-3">
        <div>
          <Dialog>
            <DialogTrigger>
              <span className="hover:underline">Login</span>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription>
                <Tabs defaultValue="recruiter-signin" className="w-[400px]">
                  <TabsList  >
                    <TabsTrigger value="recruiter-signin">Recruiter</TabsTrigger>
                    <TabsTrigger value="jobseeker-signin">Job Seeker</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recruiter-signin">
                   <RecruiterSignIn/>
                  </TabsContent>
                  <TabsContent value="jobseeker-signin">
                    <JobSeekerSignIn/>
                  </TabsContent>
                </Tabs>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>

        <div>
        <Dialog>
            <DialogTrigger>
            <span variant="rounded" className=" bg-theme text-white rounded-4xl hover:bg-theme-hover px-7 py-2 text-base"> Register </span>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription>
                <Tabs defaultValue="recruiter-signup" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="recruiter-signup">Recruiter</TabsTrigger>
                    <TabsTrigger value="jobseeker-signup">Job Seeker</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recruiter-signup">
                   <RecruiterSignUp/>
                  </TabsContent>
                  <TabsContent value="jobseeker-signup">
                    <JobSeekerSignUp/>
                  </TabsContent>
                </Tabs>
              </DialogDescription>
            </DialogContent>
          </Dialog>
      
        </div>
      </div>
    </div>
  );
}

export default Navbar;
