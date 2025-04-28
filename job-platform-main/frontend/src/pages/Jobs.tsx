import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Clock } from 'lucide-react';
import { useStore } from '../store';
import { dummyJobs } from '../data';
import { motion } from 'framer-motion';
import axios from 'axios';
import { backendurl } from '../server';
import { Job } from '../types';

function Jobs() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  const [OriginalJobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${backendurl}/jobs/get-all-jobs`);
        setJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  console.log(OriginalJobs,'jobs---')

  const filteredJobs = OriginalJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log(filteredJobs,"filteredJobs")

  const categories = [...new Set(OriginalJobs.map(job => job.category))];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500"
          >
            Find Your Next Opportunity
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-6 mb-8"
          >
            <div className="flex-1">
              <div className={`flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search jobs by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full bg-transparent focus:outline-none text-lg ${isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                />
              </div>
            </div>
            
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`p-3 rounded-xl text-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </motion.select>
          </motion.div>
        </div>

        {filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className="text-2xl font-semibold mb-2">No jobs found</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 font-poppins"
          >
            {filteredJobs?.map(job => (
              <motion.div
              key={job._id}
                variants={item}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/jobs/${job._id}`}
                  className={`block ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} p-6 rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'} transition-all duration-300`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold mb-2">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                          {job.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>
                          {job.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-bold text-blue-600 mb-1">{job.salary}</div>
                      <div className="flex items-center justify-end text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Posted {job.postedDate}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          </div>

        )}
      </div>
    </motion.div>
  );
}

export default Jobs;