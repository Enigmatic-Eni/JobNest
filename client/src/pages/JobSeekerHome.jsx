import CurrentSearch from '@/components/HomeComp/CurrentSearch'
import CategorySearch from '@/components/JobSeeker/CategorySearch'
import Jobs from '@/components/JobSeeker/Jobs'
import JobSeekerNav from '@/components/JobSeeker/JobSeekerNav'
import SearchBar from '@/components/JobSeeker/SearchBar'
import React from 'react'

export default function JobSeekerHome() {
  return (
    <div>
        <JobSeekerNav/>
        <div className=' items-center justify-center flex mb-9'>

        <SearchBar/>
        </div>
       
        <div className=' flex gap-10 mx-7 '>

        <CategorySearch/>
        <Jobs/>
        </div>
    </div>
  )
}
