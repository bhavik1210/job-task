import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../../../store';
import { dummyApplications, dummyJobs } from '../../../data';
import axios from 'axios';
import { backendurl } from '../../../server';

// const monthlyData = [
//   { month: 'Jan', jobs: 4 },
//   { month: 'Feb', jobs: 6 },
//   { month: 'Mar', jobs: 8 },
//   { month: 'Apr', jobs: 5 },
//   { month: 'May', jobs: 7 },
//   { month: 'Jun', jobs: 9 },
// ];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// const categoryData = [
//   { name: 'Development', value: 35 },
//   { name: 'Design', value: 25 },
//   { name: 'Marketing', value: 20 },
//   { name: 'Sales', value: 20 },
// ];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EmployerDashboardhero = () => {
      const isDarkMode = useStore((state) => state.isDarkMode);
      const currentUser = useStore((state) => state.currentUser);


      const [jobs, setJobs] = useState([]);
      const [monthlyData, setMonthlyData] = useState([]);

const [categoryData, setCategoryData] = useState([]);
    
      useEffect(() => {
        const fetchMyJobs = async () => {
          try {
            const response = await axios.get(`${backendurl}/jobs/my-jobs`, {
              withCredentials: true,
            });
            const fetchedJobs = response.data.jobs || [];
            setJobs(fetchedJobs);


      const categoryCount: { [key: string]: number } = {};

      fetchedJobs.forEach((job) => {
        const category = job.category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const dynamicCategoryData = Object.entries(categoryCount).map(
        ([name, value]) => ({ name, value })
      );

      setCategoryData(dynamicCategoryData);
             
        const monthlyCount = {};

        fetchedJobs.forEach((job) => {
          const createdMonth = new Date(job.createdAt).getMonth(); 
          const month = monthNames[createdMonth];

          if (!monthlyCount[month]) {
            monthlyCount[month] = 1;
          } else {
            monthlyCount[month]++;
          }
        });

        const formattedData = monthNames.map((month) => ({
          month,
          jobs: monthlyCount[month] || 0,
        }));

        setMonthlyData(formattedData);
          } catch (error) {
            console.error("Error fetching user's jobs:", error);
          }
        };
    
        fetchMyJobs();
      }, []);
    
    
      const employerJobs = jobs;

      const [applicants, setApplicants] = useState<[]>([]);
      useEffect(() => {
        const fetchApplicants = async () => {
          try {
            const response = await axios.get(`${backendurl}/application/get-all-applicants`);
            if (response.data.success) {
              setApplicants(response.data.applicants);
            } 
          } catch {
            console.log("error")
          } 
        };
    
        fetchApplicants();
      }, []);

      console.log(applicants,"applicant")
      console.log(employerJobs,"employerjobs")
      const applications = applicants.filter(app => 
        employerJobs.some(job => job._id === app.job._id)
      );

      console.log(applications,"applications")
  return (
    <div className='font-poppins'>
         <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
                <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
              </div>
        
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
                  <p className="text-3xl font-bold text-blue-600">{employerJobs.length}</p>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
                  <p className="text-3xl font-bold text-green-600">{applications.length}</p>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h3 className="text-lg font-semibold mb-2">Pending Review</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h3 className="text-lg font-semibold mb-2">Hired</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {applications.filter(app => app.status === 'accepted').length}
                  </p>
                </div>
              </div>
        
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h2 className="text-xl font-bold mb-4">Monthly Job Postings</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="jobs" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
        
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h2 className="text-xl font-bold mb-4">Jobs by Category</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
        
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
                <h2 className="text-xl font-bold p-6 border-b border-gray-200">Recent Applications</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className="px-6 py-3 text-left">Job Title</th>
                        <th className="px-6 py-3 text-left">Applicant</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map((app, index) => {
                        const job = employerJobs.find(j => j.id === app.jobId);
                        return (
                          <tr key={app.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <td className="px-6 py-4">{job?.title}</td>
                            <td className="px-6 py-4">John Doe</td>
                            <td className="px-6 py-4">{app.appliedDate}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    </div>
  )
}

export default EmployerDashboardhero