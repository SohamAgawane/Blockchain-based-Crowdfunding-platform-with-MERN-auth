
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleSuccess, handleError } from "../util";
import { ToastContainer } from "react-toastify";

 const Login = () => {
   const navigate = useNavigate();

   const [isLoginInfo, setIsLoginInfo] = useState({
     email: "",
     password: "",
   });

   const handleChange = (e) => {
     const { name, value } = e.target;
     setIsLoginInfo((prev) => ({ ...prev, [name]: value }));
   };

   const handleLogin = async (e) => {
     e.preventDefault();

     const { email, password } = isLoginInfo;

     if (!email || !password) {
       return handleError("Email and Password are required.");
     }

     try {
       const url = "http://localhost:8080/auth/login";
       const response = await fetch(url, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(isLoginInfo),
       });

       const result = await response.json();
       const { success, message, jwtToken, name, error } = result;

       if (success) {
         handleSuccess(message);
         localStorage.setItem("token", jwtToken);
         localStorage.setItem("loggedInUser", name);

         setTimeout(() => {
           navigate("/crowd-funding");
         }, 1000);
       } else if (error) {
         const details = error?.details[0]?.message;
         handleError(details || message);
       }
     } catch (err) {
       handleError(err.message || "An error occurred during login.");
     }
   };

   return (
     <div className="min-h-screen flex items-center justify-center bg-slate-100">
       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
         <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
           Login to Your Account
         </h1>

         <form className="space-y-6" onSubmit={handleLogin}>
           <div>
             <label htmlFor="email" className="block text-lg font-medium text-gray-700">
               Email
             </label>
             <input
               type="email"
               name="email"
               placeholder="Enter your email"
               value={isLoginInfo.email}
               onChange={handleChange}
               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
             />
           </div>

           <div>
             <label htmlFor="password" className="block text-lg font-medium text-gray-700">
               Password
             </label>
             <input
               type="password"
               name="password"
               placeholder="Enter your password"
               value={isLoginInfo.password}
               onChange={handleChange}
               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
             />
           </div>
           <button
             type="submit"
             className="w-full text-xl bg-green-600 text-white py-3 rounded-lg hover:bg-green-400 transition"
           >
             Login
           </button>
         </form>
         <p className="mt-4 text-center text-gray-600">
           Don’t have an account?{" "}
           <Link to="/signup" className="text-green-600 hover:underline">
             Sign Up
           </Link>
         </p>
       </div>
       <ToastContainer />
     </div>
   );
 };

 export default Login;
