import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../util";

const Signup = () => {
  const navigate = useNavigate();

  const [isSignupInfo, setIsSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = isSignupInfo;
    if (!name || !email || !password) {
      return handleError("Field: Name, Email, Password are Required");
    }

    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isSignupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create your account to start your journey
        </p>
        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              value={isSignupInfo.name}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              value={isSignupInfo.email}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              value={isSignupInfo.password}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-xl text-white bg-green-600 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Log In
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;