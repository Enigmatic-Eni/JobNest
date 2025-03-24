import React from 'react'
import Navbar from '../components/Navbar'
import SearchGradient from '../components/HomeComp/SearchGradient'
import CurrentSearch from '../components/HomeComp/CurrentSearch'
import LatestJobs from '../components/HomeComp/LatestJobs'

const Home = () => {
  return (
    <div className='mx-5 md:mx-16'>
      <Navbar/>
      <SearchGradient/>
      <div className=" mt-16 flex ">
        {/* <CurrentSearch/> */}
        <LatestJobs/>
      </div>
    </div>
  )
}

export default Home