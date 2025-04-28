import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, User } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import axios from 'axios';
import { backendurl } from '../server';
import swal from 'sweetalert'; // if you're using sweetalert
import { Popover, PopoverContent, PopoverTrigger } from '../ui/components/ui/popover';
import { Button } from '../ui/components/ui/button';

function Navbar() {
  const { isDarkMode, toggleDarkMode, currentUser } = useStore();

  const { setCurrentUser, setToken } = useStore();
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post(`${backendurl}/user/logout`, {}, { withCredentials: true });
  
      setCurrentUser(null);
      setToken(null);
  
      swal("Logged Out", "You have been successfully logged out!", "success");
      navigate("/login");
    } catch (error) {
      console.error('Logout Error:', error);
      swal("Logout Failed", error|| "Something went wrong", "error");
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${isDarkMode ? 'dark bg-gray-800' : 'bg-white'} shadow-md !font-poppins`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              JobPortal
            </Link>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/jobs" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>
                Jobs
              </Link>
            </motion.div>

            {currentUser ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <User className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-52 p-2 mt-2 rounded-xl shadow-lg border bg-white dark:bg-gray-800">
                <div className="flex flex-col">
                  <Link
                    to={`/${currentUser.role}/dashboard`}
                    className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-md text-sm font-semibold text-red-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </PopoverContent>

              </Popover>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}
                >
                  Login
                </Link>
              </motion.div>
            )}

            <motion.button
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
