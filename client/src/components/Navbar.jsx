import React from 'react'
import { Assets } from '../assets/Assets'
import {useNavigate} from 'react-router-dom'
import { Button } from './ui/button'

function Navbar() {

  const navigate = useNavigate()
  return (
    <div className=' flex items-center justify-between py-6 '>
        <div className="Logo flex items-center">
          <div onClick={navigate('../JobDescription')}>
        <img src={Assets.logo} alt="JobNest Logo" className=' md:w-16'/>
        </div>
        <a href='' className=' text-2xl font-bold'>JobNest</a>
        </div>

        <div className="login-button space-x-3">
            <a href="" className=' hover:underline'>Recruiter Login</a>
            <Button variant="rounded" className=" px-7 py-2 text-base">Register</Button>
        </div>


    </div>
  )
}

export default Navbar