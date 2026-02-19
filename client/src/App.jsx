import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import JobDescription from './pages/JobDescription'
import JobSeekerHome from './pages/JobSeekerHome'
// import RecruiterHome from './pages/RecruiterHome'
import StudentProfile from './pages/StudentProfile'

function App() {
 

  return (
    < div className=' font-montserrat'>
 <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path = 'jobdescription' element={<JobDescription/>}/>
    <Route path = 'home' element={<JobSeekerHome/>}/>
     {/* <Route path = 'recruiter-home' element={<RecruiterHome/>}/> */}
    <Route path = 'profile' element={<StudentProfile/>}/>

   </Routes>
    </div>
  )
}

export default App
