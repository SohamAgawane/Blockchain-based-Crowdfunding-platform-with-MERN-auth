import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  Info,
  Mail,
  Wallet2,
  LogIn,
  LogOut,
} from "lucide-react";
import { handleSuccess } from "../util";

function Header({ onClick }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Logout Successfully.");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    // CENTERED FLOATING HEADER
    <header className="fixed top-5 sm:top-7 inset-x-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -16, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-auto flex items-center gap-5 sm:gap-6 px-6 sm:px-8 py-2.5 rounded-full border border-slate-200 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-md"
      >
        {/* BRAND */}
        <Link
          to="home"
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-sm">
            <HomeIcon className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline text-sm font-semibold tracking-tight text-slate-900">
            PRO FUND
          </span>
        </Link>

        {/* DIVIDER */}
        <span className="h-5 w-px bg-slate-200" />

        {/* SCROLL LINKS */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="about-us"
            spy={true}
            smooth={true}
            offset={-85}
            duration={500}
            activeClass="text-slate-900"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </Link>

          <Link
            to="contact-us"
            spy={true}
            smooth={true}
            offset={-115}
            duration={500}
            activeClass="text-slate-900"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </Link>
        </div>

        {/* DIVIDER */}
        <span className="h-5 w-px bg-slate-200" />

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/crowd-funding"
                onClick={onClick}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Wallet2 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={onClick}
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </NavLink>
          )}
        </div>
      </motion.div>
    </header>
  );
}

export default Header;
