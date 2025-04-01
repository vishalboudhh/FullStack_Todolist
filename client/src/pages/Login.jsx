import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  // Login.jsx
const loginHandler = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/user/login`,
      user,
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    if (response.data.success) {
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      toast.success(response.data.message);
      navigate('/');
    }
  } catch (error) {
    toast.error("Login failed!");
  }
};

  const registerHandler = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={loginHandler}>
          <div className="mb-4">
            <Input
              value={user.email}
              name="email"
              onChange={changeHandler}
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <Input
              value={user.password}
              name="password"
              onChange={changeHandler}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <p
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={registerHandler}
            >
              Don't have an account?
            </p>
          </div>
          <Button 
            type="submit" 
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login;
