import React, { useRef, useState } from 'react'
import { Assets } from "../../assets/Assets";
// import { useNavigate } from "react-router-dom";

export default function JobSeekerNav() {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e)=>{
    e.preventDefault();
    setDropdown(!dropdown)
  }
  return (
    <div className=" flex items-center justify-between py-6 px-8">
          <div className="Logo flex items-center">
            <div>
              <img src={Assets.logo} alt="JobNest Logo" className="w-16" />
            </div>
            <a href="" className=" text-2xl font-bold hidden sm:block">
              JobNest
            </a>
          </div>
    
    
            <div className=' flex items-center gap-5'>
              <a href="" className='hover:cursor-pointer hover:text-theme'>Applied Jobs</a>

              |

<div className=' flex items-center gap-3'>
 <p className=''>Hello Oluwaseun</p>

 <div className='relative' ref={dropdownRef}>
           <img src={Assets.person} alt="Profile picture" className='w-7 bg-theme rounded-full cursor-pointer' onClick={toggleDropdown} onMouseEnter={()=> setDropdown(true)}/>

           <div onMouseLeave={()=> setDropdown(false)} className=  {`dropdown absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg z-10 ${dropdown ? 'block' : 'hidden'}`}>
<ul className=' py-2 text-sm text-gray-700'>
  <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Profile</li>
  <li className='
  px-4 py-2 hover:bg-gray-100 cursor-pointer'>Logout</li>
</ul>
           </div>

 </div>

</div>
            </div>
          </div>
  )
}
