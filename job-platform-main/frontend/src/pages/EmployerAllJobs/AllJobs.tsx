import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { backendurl } from '../../server';
import { Skeleton } from '../../ui/components/ui/skeleton';
import { useStore } from '../../store';

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  postedDate: string;
  category: string;
  requirements: string[];
  userId: string;
};

const AllJobs: React.FC = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const response = await axios.get(`${backendurl}/jobs/my-jobs`, {
          withCredentials: true,
        });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching user's jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const openPopover = (job: Job) => {
    setSelectedJob(job);
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
    setSelectedJob(null);
  };

  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const Popover: React.FC<{ job: Job; closePopover: () => void }> = ({ job, closePopover }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-opacity-50 bg-black flex justify-center items-center"
        onClick={closePopover} // Close on overlay click
      >
        <motion.div
          className={`bg-white rounded-xl shadow-lg p-8 mb-8 border max-w-4xl w-full relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={closePopover}
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold mb-6">{job.title}</h2>

          {/* Job Information */}
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">{job.company}</span>
              <span className="text-gray-500">{job.location}</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold text-blue-600">{job.salary}</div>
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>{job.postedDate}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="text-gray-700 mb-6">
            <h3 className="font-semibold text-xl mb-3">Job Description</h3>
            <p>{job.description}</p>
          </div>

          {/* Job Requirements */}
          <div className="text-gray-700 mb-6">
            <h3 className="font-semibold text-xl mb-3">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Job Type and Category */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {job.type}
            </span>
            <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              {job.category}
            </span>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500"
        >
          My Posted Jobs
        </motion.h1>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className="text-2xl font-semibold mb-2">You haven't posted any jobs</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Start by creating your first job listing!</p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 font-poppins"
          >
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                variants={item}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/jobs/${job._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    openPopover(job);
                  }}
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
        )}
      </div>

      {/* Conditionally render Popover */}
      {popoverOpen && selectedJob && <Popover job={selectedJob} closePopover={closePopover} />}
    </motion.div>
  );
};

export default AllJobs;
