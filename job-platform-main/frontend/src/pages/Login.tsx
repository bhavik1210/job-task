import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useStore } from '../store';
import { Alert } from '../ui/components/ui/alert';
import { Input } from '../ui/components/ui/input';
import { Button } from '../ui/components/ui/button';
import axios from 'axios';
import { backendurl } from '../server';
import swal from 'sweetalert';
import Cookies from 'js-cookie';

function Login() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
const setToken = useStore((state) => state.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendurl}/user/login`, { email, password }, { withCredentials: true });

      if (response.data) {
        const { user } = response.data;
        const token = Cookies.get('token'); // Get token from cookies (auto set by backend)

        setToken(token);  // Store token using Zustand store
        setCurrentUser(user);  // Store user in Zustand store

        swal("Login Successful", `Welcome ${user.name}!`, "success");
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      swal("Login Failed", error.response?.data?.message || "Something went wrong", "error");
      setError('Invalid credentials');
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-[90vh] px-4 font-poppins">
      <div className={`w-full max-w-md md:max-w-lg lg:max-w-lg px-6 sm:px-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl py-10`}>
        <div className="flex items-center justify-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Welcome Back
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
