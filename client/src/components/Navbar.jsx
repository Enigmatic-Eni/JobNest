import React from 'react'
import { Assets } from '../assets/Assets'
import {useNavigate} from 'react-router-dom'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function Navbar() {

  // const navigate = useNavigate()
  return (
    <div className=' flex items-center justify-between py-6 '>
        <div className="Logo flex items-center">
          <div >
        <img src={Assets.logo} alt="JobNest Logo" className=' md:w-16'/>
        </div>
        <a href='' className=' text-2xl font-bold'>JobNest</a>
        </div>

        <div className="login-button space-x-3">
          <div>
          <Dialog>
  <DialogTrigger><a href="" className=' hover:underline'>Recruiter Login</a></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

          </div>
            <a href="" className=' hover:underline'>Recruiter Login</a>
            <Button variant="rounded" className=" px-7 py-2 text-base">Register</Button>
        </div>


    </div>
  )
}

export default Navbar