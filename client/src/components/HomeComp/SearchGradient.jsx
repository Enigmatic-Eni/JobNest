import React from 'react'
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { Assets } from '../../assets/Assets';

function SearchGradient() {
  return (
    <div>
        <div className="purple-grad bg-gradient-to-r from-theme to-[#130121] py-20 text-white flex flex-col items-center rounded-2xl justify-center px-2.5">
            <p className=' text-4xl font-medium text-center'>Over 10,000+ Jobs to Apply</p>
            <p className=' text-center text-sm mt-4'>Your Next Big career Move Starts Right Here <br></br>Explore The Best Job Opportunities and Take the First Step Toward Your Future!</p>
            {/* <div className="search-bar">
            <div className="relative w-full max-w-[599px] text-text">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                    <input
                        type="text"
                        className=" w-[599px] pl-10 pr-4 py-4 bg-white rounded focus:outline-none"
                        placeholder=" Search for Jobs"
                    />
         
         <CiLocationOn className="absolute right-[18rem] top-1/2 -translate-y-1/2 text-gray-500" />

         <p className=' absolute right-[13rem] top-1/2 -translate-y-1/2'>Location</p>

         <button className=' absolute right-3 rounded top-1/2 -translate-y-1/2 bg-theme py-3 px-8 text-white hover:bg-theme-hover cursor-pointer'>Search</button>
                </div>
            </div> */}
        </div>

        <div className="trusted-by flex items-center mt-11 py-7 shadow-sm border-[#bdbaba] gap-9 pl-2 md:pl-8 flex-wrap">
      <p className='text-text'>Trusted by</p>
      <img src={Assets.microsoftLogo} alt="Microsoft Logo" />
      <img src={Assets.walmartLogo} alt="Walmart Logo" />
      <img src={Assets.accentureLogo} alt="Accenture Logo" className='w-[87px] h-[29px]' />
    </div>
    </div>
  )
}

export default SearchGradient