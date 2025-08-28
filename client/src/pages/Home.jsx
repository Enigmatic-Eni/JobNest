import React from 'react';
import SearchGradient from '../components/HomeComp/SearchGradient';
import LatestJobs from '../components/HomeComp/LatestJobs';
import Footer from '@/components/Footer';
import { Assets } from "../assets/Assets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import JobSeekerSignIn from "@/components/SignIn/JobSeekerSignIn";
import SignUp from '@/components/SignUp';

const Home = () => {
  return (

  
    <div className='mx-5 md:mx-16'>

   
      <div className="flex items-center justify-between py-6">
        <div className="Logo flex items-center">
          <img src={Assets.logo} alt="JobNest Logo" className="w-16" />
          <a href="#" className="text-2xl font-bold hidden sm:block">JobNest</a>
        </div>

        <div className="login-button flex items-center space-x-3">
          <Dialog>
            <DialogTrigger>
              <span className="hover:underline">Login</span>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className=""></DialogTitle>
              <DialogDescription className="" >
               
              </DialogDescription>
              <Tabs defaultValue="recruiter-signin" className="w-[300px] md:w-[400px]">
                <TabsList>
                  <TabsTrigger value="recruiter-signin">Recruiter</TabsTrigger>
                  <TabsTrigger value="jobseeker-signin">Job Seeker</TabsTrigger>
                </TabsList>
                <TabsContent value="recruiter-signin">
                  <SignUp/>
                </TabsContent>
                <TabsContent value="jobseeker-signin">
                  <JobSeekerSignIn />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <span className="bg-theme text-white rounded-4xl hover:bg-theme-hover px-7 py-2 text-base">
                Register
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className=""></DialogTitle>
              <DialogDescription className="">
        
              </DialogDescription>
             

              <SignUp/>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SearchGradient />
      <div className="mt-16">
        <LatestJobs />
      </div>
      <Footer />
    </div>
  );
};

export default Home;