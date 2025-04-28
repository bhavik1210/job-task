import { Link } from "react-router-dom"
import { useStore } from "../../store"
import { motion } from "framer-motion"
import { Briefcase, Search, Building, Users, ArrowRight } from "lucide-react"

const Homesec1 = () => {
  const isDarkMode = useStore((state) => state.isDarkMode)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  }

  const floatingIconVariants = {
    initial: { y: 0 },
    animate: (custom: number) => ({
      y: [0, -10, 0],
      transition: {
        delay: custom * 0.3,
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    }),
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`relative overflow-hidden z-0 py-16 min-h-[90vh] flex flex-col justify-center items-center text-center ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} font-poppins`}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]" />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-10 left-4 sm:top-20 sm:left-10 opacity-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        custom={2}
      >
        <Briefcase size={60} className="sm:size-[80px]" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 opacity-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        custom={1}
      >
        <Building size={60} className="sm:size-[80px]" />
      </motion.div>

      <motion.div
        className="absolute top-28 right-8 sm:top-40 sm:right-20 opacity-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        custom={2}
      >
        <Search size={50} className="sm:size-[60px]" />
      </motion.div>

      <motion.div
        className="absolute bottom-28 left-8 sm:bottom-40 sm:left-20 opacity-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        custom={3}
      >
        <Users size={50} className="sm:size-[60px]" />
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-2 flex justify-center" variants={itemVariants}>
            <motion.div
              className={`inline-flex items-center px-4 py-1 rounded-full text-sm ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}
              whileHover={{ scale: 1.05 }}
            >
              <span>Over 10,000+ jobs available</span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            Find Your <span className="text-blue-600">Dream Job</span> Today
          </motion.h1>

          <motion.p
            className="text-base sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-80"
            variants={itemVariants}
          >
            Connect with top employers and discover opportunities that match your skills and career aspirations. Your
            next career move is just a click away.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row justify-center gap-4 mb-16" variants={itemVariants}>
            <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap={{ scale: 0.95 }}>
              <Link
                to="/jobs"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 w-full sm:w-auto"
              >
                <Search size={20} />
                <span>Browse Jobs</span>
                <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap={{ scale: 0.95 }}>
              <Link
                to="/employer/new-job"
                className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto ${
                  isDarkMode
                    ? "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Building size={20} />
                <span>Post a Job</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 sm:gap-8 opacity-80">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05, opacity: 1 }}>
              <div className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <Users size={16} />
              </div>
              <span className="text-sm">10k+ Employers</span>
            </motion.div>

            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05, opacity: 1 }}>
              <div className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <Briefcase size={16} />
              </div>
              <span className="text-sm">100k+ Job Listings</span>
            </motion.div>

            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05, opacity: 1 }}>
              <div className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <Search size={16} />
              </div>
              <span className="text-sm">50k+ Searches Daily</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Homesec1
