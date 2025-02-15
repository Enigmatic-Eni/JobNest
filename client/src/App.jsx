import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

function App() {
 

  return (
    < div className=' font-montserrat'>
   <Routes>
    <Route path='/' element={<Home/>}/>
   </Routes>
    </div>
  )
}

export default App
