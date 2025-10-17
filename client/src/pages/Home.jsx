import React, { useState } from 'react';
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
import SignUp from '@/components/SignUp';
import SignIn from '@/components/SignIn';

const Home = () => {

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (

  
    <div className='mx-5 md:mx-16'>

   
      <div className="flex items-center justify-between py-6">
        <div className="Logo flex items-center">
          <img src={Assets.logo} alt="JobNest Logo" className="w-16" />
          <a href="#" className="text-2xl font-bold hidden sm:block">JobNest</a>
        </div>

        <div className="login-button flex items-center space-x-3">

          <Dialog open={openLogin} onOpenChange={setOpenLogin}>
            <DialogTrigger>
              <span className="hover:underline">Login</span>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <SignIn closeDialog={()=> setOpenLogin(false)}/>
            </DialogContent>
          </Dialog>

           <Dialog open={openRegister} onOpenChange={setOpenRegister}>
  <DialogTrigger>
     <span className="bg-theme text-white rounded-4xl hover:bg-theme-hover px-7 py-2 text-base">
       Register
     </span>
   </DialogTrigger>
   <DialogContent>
     <DialogTitle></DialogTitle>
     <DialogDescription></DialogDescription>
     <SignUp 
       openLoginDialog={() => {
         setOpenRegister(false); // close Register modal
         setOpenLogin(true); // open Login modal
       }} 
     />
   </DialogContent>
 </Dialog>
{/* 
          <Dialog>
            <DialogTrigger>
              <span className="bg-theme text-white rounded-4xl hover:bg-theme-hover px-7 py-2 text-base">
                Register
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <SignUp/>
            </DialogContent>
          </Dialog> */}
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