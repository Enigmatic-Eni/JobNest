import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JobDescription from "./pages/JobDescription";
import JobSeekerHome from "./pages/JobSeekerHome";
// import RecruiterHome from './pages/RecruiterHome'
import StudentProfile from "./pages/StudentProfile";
import JobDetail from "./pages/JobDetail";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div className=" font-montserrat">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="jobdescription" element={<JobDescription />} />
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <JobSeekerHome />
            </ProtectedRoute>
          }
        />
        {/* <Route path = 'recruiter-home' element={<RecruiterHome/>}/> */}
        <Route path="job/:id" element={<JobDetail />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>


      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#10b981", color: "#fff" },
        }}
      />
    </div>
  );
}

export default App;
