import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: ""
  })

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const RegisterHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/register`,
        user,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login')
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed!");
    }
  };

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={RegisterHandler}>
          <div className="mb-4">
            <Input
              value={user.fullName}
              name="fullName"
              onChange={changeHandler}
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
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
          <div className="flex justify-between items-center mb-6">
            <p 
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={goToLogin}
            >
              Already have an account?
            </p>
          </div>
          <Button 
            type="submit" 
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register;
