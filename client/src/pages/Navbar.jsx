import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/v1/user/me',
          { withCredentials: true }
        );
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        // Log the error for debugging purposes and show a user-friendly message.
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  // Navbar.jsx
const logoutHandler = async () => {
  try {
    const res = await axios.get(
      'http://localhost:8000/api/v1/user/logout',
      { withCredentials: true }
    );
    if (res.data.success) {
      localStorage.removeItem("token"); // Clear token
      toast.success(res.data.message);
      navigate('/login');
    }
  } catch (error) {
    toast.error("Logout failed!");
  }
};
  return (
    <div className="bg-gray-600 rounded-2xl flex justify-evenly">
      <div className="max-w-6xl flex p-2 items-center gap-24">
        <h1 className="font-bold text-2xl">Username: {user.fullName || 'User'}</h1>
        <h1 className="font-bold text-2xl">Email: {user.email || 'Email'}</h1>
        <Button className="bg-blue-500 cursor-pointer" onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
