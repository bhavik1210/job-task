import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Input } from '../ui/components/ui/input';
import { Button } from '../ui/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/components/ui/select';
import { Label } from '../ui/components/ui/label';
import { useStore } from '../store';
import { backendurl } from '../server';
import axios from 'axios';

import swal from 'sweetalert';

function Register() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker',
    company: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData); 
    // navigate('/login');

    try {
      const response = await axios.post(`${backendurl}/user/register`, formData);
      swal("Account Created!", "You can now log in.", "success");
      navigate('/login'); // Only navigate after successful registration
    } catch (error) {
      console.error('Registration Error:', error);
      // You can also show an alert or error message to user here
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[90vh] p-6 font-poppins">
      <div className={`w-full max-w-lg p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border border-gray-100`}>
        
        <div className="flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-xl font-bold text-center mb-5">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div className="space-y-1.5">
            <Label className="text-base dark:text-gray-200">Full Name</Label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`text-base ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-base dark:text-gray-200">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`text-base ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-base dark:text-gray-200">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`text-base ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-base dark:text-gray-200">Account Type</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className={`text-base ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jobseeker" className="text-base">Job Seeker</SelectItem>
                <SelectItem value="employer" className="text-base">Employer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === 'employer' && (
            <div className="space-y-1.5">
              <Label className="text-base dark:text-gray-200">Company Name</Label>
              <Input
                type="text"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={` ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-sm py-2.5 font-semibold tracking-wide !mt-3"
          >
            Create Account
          </Button>

          {/* Link to Login */}
          <p className="text-center  dark:text-gray-200 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
