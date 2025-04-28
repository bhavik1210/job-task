import EmployerSidebar from '../pages/Employersidebar/EmployerSidebar'
import CreateJobForm from './CreateJobForm'

const Newjobmain = () => {
  return (
         <div className="flex min-h-screen">
      {/* Sidebar */}
     <EmployerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <CreateJobForm />
      </div>
      </div>

  )
}

export default Newjobmain