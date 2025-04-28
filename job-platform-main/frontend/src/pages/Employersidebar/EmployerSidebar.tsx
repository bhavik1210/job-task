import React from 'react';
import { motion } from 'framer-motion';
import { Home, PlusCircle, List, LogOut, Briefcase } from 'lucide-react';
import { Button } from '../../ui/components/ui/button';
import { Separator } from '../../ui/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { backendurl } from '../../server';
import axios from 'axios';
import { useStore } from '../../store';
import swal from 'sweetalert'; // if you're using sweetalert


const EmployerSidebar = () => {

    const navigate = useNavigate(); 
      const { setCurrentUser, setToken } = useStore();
    

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
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: PlusCircle, label: 'Post Job', path: '/employer/new-job' },
    { icon: Briefcase, label: 'My Jobs', path: '/employer/all-jobs' },
    { icon: List, label: 'Applications', path: '/employer/applications' },
  ];

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 min-h-screen bg-background border-r flex flex-col justify-between p-6 font-poppins"
    >
      {/* Top Section */}
      <div>
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center gap-3 mb-8 pl-2"
        >
          <Briefcase className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Employer Portal</h2>
        </motion.div>

        <nav className="space-y-1">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:bg-accent transition-all rounded-lg px-3 py-6"
                onClick={() => navigate(item.path)} 
              >
                <item.icon className="mr-3 h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </Button>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Separator className="my-4 bg-border" />
        <Button
          variant="outline"
          className="w-full justify-start text-foreground hover:bg-accent transition-all rounded-lg px-3 py-6"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EmployerSidebar;