import React from 'react'
import Navbar from '../components/Navbar'
import SearchGrad from '../components/HomeComp/SearchGrad'

const Home = () => {
  return (
    <div className='mx-5 md:mx-16'>
      <Navbar/>
      <SearchGrad/>
    </div>
  )
}

export default Home