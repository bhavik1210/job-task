import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Clock, BriefcaseIcon, Send } from 'lucide-react';
import { useStore } from '../store';
import { dummyJobs } from '../data';
import { motion } from 'framer-motion';
import { Application, Job } from '../types';
import axios from 'axios';
import { backendurl } from '../server';
import { Dialog, DialogContent, DialogTrigger } from '../ui/components/ui/dialog';
import swal from 'sweetalert';


function JobDetails() {
  const { id } = useParams();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  console.log(currentUser,'current user')

  const [jobs, setJobs] = useState<Job[]>([]); // State to hold all jobs
  const [job, setJob] = useState<Job | null>(null); // State to hold the specific job
  const [loading, setLoading] = useState(true); // Loading state

  const [open, setOpen] = useState(false); 
  const [coverLetter, setCoverLetter] = useState('');  // Store cover letter
  const [resume, setResume] = useState<File | null>(null);  // Store resume
  const [uploading, setUploading] = useState(false);  // Track if uploading
  const [resumeUrl, setResumeUrl] = useState<string>(''); 
    // Handle resume file change
    
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  // Handle cover letter change
  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoverLetter(e.target.value);
  };
  // Fetch all jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${backendurl}/jobs/get-all-jobs`);
        setJobs(response.data.jobs); // Save all jobs
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); 

  // Find the specific job by ID
  useEffect(() => {
    if (id) {
      const foundJob = jobs.find(job => job._id === id); 
      setJob(foundJob || null); 
    }
  }, [id, jobs]); 
  
  // const job = dummyJobs.find(j => j.id === id);
  
  if (!job) {
    return <div>Job not found</div>;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  const handleSubmitApplication = async () => {
    if (!resume) {
      alert('Please select a resume file.');
      return;
    }
  
    if (!coverLetter) {
      alert('Please write a cover letter.');
      return;
    }
  
    if (!currentUser || !currentUser?._id) {
      alert('You must be logged in to apply.');
      return;
    }
  
    try {
      setUploading(true);
  
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('userId', currentUser?._id); // ✅ Now TypeScript is happy
      formData.append('coverLetter', coverLetter);
      formData.append('jobId', id || '');
  
      const uploadResponse = await axios.post(`${backendurl}/application/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (uploadResponse.data.success) {
        swal("Applied successfully", `Application submitted successfully!`, "success");
        
        setOpen(false);
      } else {
        alert('Failed to submit application.');
      }
    } catch (error) {
      console.error('Error uploading resume or submitting application:', error);
      alert('An error occurred while submitting your application.');
    } finally {
      setUploading(false);
    }
  };
  
    
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`relative ${isDarkMode ? 'text-white' : 'text-gray-900'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins`}
    >
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8 border ${
          isDarkMode ? 'border-gray-700' : 'border-gray-100'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex flex-wrap items-center text-gray-500 mb-4 gap-4">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{job.location}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {job.type}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {job.category}
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">{job.salary}</div>
            <div className="flex items-center justify-end text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>Posted {job.postedDate}</span>
            </div>
          </motion.div>
        </div>

        {currentUser?.role === 'jobseeker' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg shadow-md transition-all flex items-center justify-center !font-poppins"
        >
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <Send className="w-5 h-5 mr-2" />
                Apply Now
              </div>
            </DialogTrigger>

            {/* Dialog Content */}
            <DialogContent className="bg-white rounded-lg p-8 sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/3 shadow-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-3xl font-semibold text-center mb-6 text-gray-800">Apply for Job</h3>

              {/* Resume Upload */}
              <div className="mb-6">
                <label htmlFor="resume" className="text-sm font-medium text-gray-600 block mb-2">Upload Your Resume</label>
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-3 rounded-md w-full bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cover Letter Input */}
              <div className="mb-6">
                <label htmlFor="coverLetter" className="text-sm font-medium text-gray-600 block mb-2">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={handleCoverLetterChange}
                  placeholder="Write a cover letter..."
                  className="border border-gray-300 p-3 rounded-md w-full h-32 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Application Button */}
              <div className="mb-4">
                <button
                  onClick={handleSubmitApplication}
                  disabled={uploading}
                  className="w-full py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading & Submitting...' : 'Submit Application'}
                </button>
              </div>

              {/* Close Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setOpen(false)} // Close dialog
                  className="text-red-500 font-medium"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.button>
      )}



      



      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6">
              Job Description
            </motion.h2>
            <motion.p variants={itemVariants} className="mb-6 whitespace-pre-line">
              {job.description}
            </motion.p>

            <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4">
              Requirements
            </motion.h3>
            <motion.ul variants={itemVariants} className="list-disc pl-6 space-y-3">
              {job.requirements.map((req, index) => (
                <motion.li 
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.1 }
                    }
                  }}
                >
                  {req}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <motion.h2 variants={itemVariants} className="text-xl font-bold mb-6">
              Company Overview
            </motion.h2>
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <div className={`w-14 h-14 rounded-lg ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              } flex items-center justify-center mr-4`}>
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </motion.div>
            <motion.p variants={itemVariants} className="text-gray-500">
              Leading technology company specializing in innovative solutions...
            </motion.p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <motion.h2 variants={itemVariants} className="text-xl font-bold mb-6">
              Similar Jobs
            </motion.h2>
            {/* You can add similar jobs here */}
            <motion.p variants={itemVariants} className="text-gray-500">
              More opportunities from {job.company} and similar companies...
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default JobDetails;