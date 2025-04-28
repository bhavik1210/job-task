import React from 'react'
import EmployerSidebar from '../Employersidebar/EmployerSidebar'
import AllJobs from './AllJobs'

const EmployerAllJobsMain = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
     <EmployerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <AllJobs />
      </div>
    </div>
  )
}

export default EmployerAllJobsMain