import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './helper/ProtectedRoute';
import CreateJobForm from './NewJob/CreateJobForm';
import Newjobmain from './NewJob/Newjobmain';
import EmployerAllJobsMain from './pages/EmployerAllJobs/EmployerAllJobsMain';
import EmployerApplicantMain from './pages/EmployerApplicant/EomplyerApplicantmain';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);
    const setCurrentUser = useStore((state) => state);
    console.log(setCurrentUser,"set curerent user")
  

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <BrowserRouter>
        <Navbar />
        <main className=" mx-auto px-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />


            


              
            <Route path="/employer/new-job" element={
              <ProtectedRoute allowedRoles={['employer']}>
              <Newjobmain />
              </ProtectedRoute>
              
              } />
            <Route path="/employer/all-jobs" element={
              <ProtectedRoute allowedRoles={['employer']}>
              <EmployerAllJobsMain />
               </ProtectedRoute>} />
            <Route path="/employer/applications" element={
              <ProtectedRoute allowedRoles={['employer']}>
              <EmployerApplicantMain />
               </ProtectedRoute>} />


            




            

            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['employer']}>

              <EmployerDashboard />
              </ProtectedRoute>
              } />
            <Route path="/jobseeker/dashboard" element={
               <ProtectedRoute allowedRoles={['jobseeker']}>
               <JobSeekerDashboard />
             </ProtectedRoute>
              } />


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;