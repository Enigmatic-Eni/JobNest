import React from 'react'
import { Assets } from '../assets/Assets'
import {useNavigate} from 'react-router-dom'

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

        <div className="login-button">
            <a href="" className=' hover:underline'>Recruiter Login</a>
            <button className=' ml-3 bg-theme text-white px-7 py-2 rounded-4xl cursor-pointer hover:bg-theme-hover'>Register</button>
        </div>


    </div>
  )
}

export default Navbar