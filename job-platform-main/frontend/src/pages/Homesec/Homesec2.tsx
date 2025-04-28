import { Briefcase, Search, Building2 } from 'lucide-react';
import { useStore } from '../../store';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

const Homesec2 = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        duration: 0.5
      },
    },
    whileHover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.2 }
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 font-poppins">
      <motion.div 
        ref={ref}
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div 
          className="text-center mb-12 md:mb-16"
          variants={headingVariants}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-">
            Find Your Dream Job
          </h2>
          <p className={`text-md md:text-md max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover opportunities that match your skills and aspirations with our powerful tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div 
            variants={cardVariants}
            whileHover="whileHover"
            className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} transition-all`}
          >
            <div className={`w-16 h-16 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center mb-6`}>
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Search Jobs</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Browse through thousands of job listings from top companies worldwide with advanced filters.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover="whileHover"
            className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} transition-all`}
          >
            <div className={`w-16 h-16 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center mb-6`}>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Apply</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Apply to multiple jobs with just a few clicks using your pre-filled profile and saved resumes.
            </p>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover="whileHover"
            className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} transition-all`}
          >
            <div className={`w-16 h-16 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center mb-6`}>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Company Insights</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get detailed insights about company culture, benefits, and employee reviews before applying.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Homesec2;