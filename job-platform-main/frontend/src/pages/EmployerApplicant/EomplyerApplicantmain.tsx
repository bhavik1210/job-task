import EmployerSidebar from '../Employersidebar/EmployerSidebar'
import Applicantapplied from './Applicantapplied'

const EmployerApplicantMain = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
     <EmployerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <Applicantapplied />
      </div>
    </div>
  )
}

export default EmployerApplicantMain