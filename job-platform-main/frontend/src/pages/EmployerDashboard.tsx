
import EmployerDashboardhero from "./EmployerDashboard/Employerdahboardhero.jsx/EmployerDashboardhero";
import EmployerSidebar from "./Employersidebar/EmployerSidebar";

function EmployerDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
     <EmployerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <EmployerDashboardhero />
      </div>
    </div>
  );
}

export default EmployerDashboard;
