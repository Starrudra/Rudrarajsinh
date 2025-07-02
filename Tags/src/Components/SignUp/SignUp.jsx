import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); 
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validatePassword = (password) => {
    const regex = /^[A-Z].{5,}$/;
    return regex.test(password);
  };

  const handleSignUp = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error("Password must be at least 6 characters long and include at least one letter and one number.");
      return;
    }
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = existingUsers.find(user => user.email === form.email);
  if (userExists) {
    toast.error("User with this email already exists.");
    return;
  }

  existingUsers.push(form);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  localStorage.setItem("currentUser", JSON.stringify(form));
  toast.success("Account created successfully!");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f2937] text-white">
      <div className="bg-[#111827] p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-4 font-semibold">Sign Up</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-[#333b46]"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          className="w-full p-2 mb-3 rounded bg-[#333b46]"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="w-full p-2 mb-4 rounded bg-[#333b46]"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button className="bg-green-500 w-full p-2 rounded" onClick={handleSignUp}>
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-green-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
