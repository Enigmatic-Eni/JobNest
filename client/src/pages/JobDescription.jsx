import React from 'react'
import Navbar from '../components/Navbar'
import JobDetails from '../components/JobDesc-Comp/JobDetails'
import KeyResp from '../components/JobDesc-Comp/KeyResp'
import MoreJobs from '../components/JobDesc-Comp/MoreJobs'

function JobDescription() {
  return (
    <div className=' mx-8'>
      <Navbar/>
      <div>
        <JobDetails/>
        <div className=' flex justify-between mt-8'>
          <div >
          <KeyResp/>
          </div>
          <div className=' hidden lg:block'>
          <MoreJobs/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDescription