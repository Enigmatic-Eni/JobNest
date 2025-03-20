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
              <button className="hover:underline">Login</button>
            </DialogTrigger>
            <DialogContent>
              <DialogDescription>
                <Tabs defaultValue="account" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="account">Recruiter</TabsTrigger>
                    <TabsTrigger value="password">Job Seeker</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    Make changes to your account here.
                  </TabsContent>
                  <TabsContent value="password">
                    Change your password here.
                  </TabsContent>
                </Tabs>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        <Button variant="rounded" className=" px-7 py-2 text-base">
          Register
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
