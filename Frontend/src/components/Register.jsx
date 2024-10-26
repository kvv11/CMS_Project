import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    prezime: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Unesite ime';
    }
    if (!formData.prezime) {
      newErrors.prezime = 'uNesite prezime';
    }
    if (!formData.email) {
      newErrors.email = 'Unesite Email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nevazeci eemail';
    }
    if (!formData.password) {
      newErrors.password = 'Unesite sifru';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post('https://localhost:5001/api/auth/register', formData);
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error('There was an error registering!', error);
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.errors) {
        const apiErrors = error.response.data.errors;
        const newErrors = {};

        if (apiErrors.Email) {
          newErrors.email = 'Email is already in use';
        }
        if (apiErrors.Password) {
          newErrors.password = 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }

        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gwhite">
      <form onSubmit={handleSubmit} className="dark:bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center text-white">Register</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-white" htmlFor="username">
            Ime
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
          {errors.username && <p className="text-red-500 text-xs mt-2">{errors.username}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-white" htmlFor="prezime">
            Prezime
          </label>
          <input
            type="text"
            name="prezime"
            id="prezime"
            value={formData.prezime}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
          {errors.prezime && <p className="text-red-500 text-xs mt-2">{errors.prezime}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-white" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-white" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
