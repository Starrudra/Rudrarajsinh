import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignIn = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (!form.email.trim() || !form.password.trim()) {
      return toast.error("Email and password are required!");
    }

    const matchedUser = storedUsers.find((user) => user.email === form.email);

    if (!matchedUser) {
      return toast.error("No account found with this email!");
    }

    if (matchedUser.password !== form.password) {
      return toast.error("Incorrect password!");
    }

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    toast.success("Login successful!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f2937] text-white">
      <div className="bg-[#111827] p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-4 font-semibold">Sign In</h2>
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
        <button
          className="bg-green-500 w-full p-2 rounded"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
