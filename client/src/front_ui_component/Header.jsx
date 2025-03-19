import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { handleSuccess } from "../util";

function Header({ onClick }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItemClass =
    "block py-2 px-4 text-lg font-medium text-green-700 hover:text-black transition duration-300";

  const buttonClass =
    "px-4 py-2 text-lg font-semibold border border-transparent rounded-md bg-white text-green-700 hover:bg-green-700 hover:text-white transition duration-300";

  return (
    <header className="fixed top-0 w-full bg-white text-green-700 shadow-md z-50">
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        <Link
          to="home"
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
          className="text-2xl font-bold cursor-pointer"
        >
          PRO FUND
        </Link>

        <ul className="hidden cursor-pointer md:flex space-x-6">
          <li>
            <Link
              to="about-us"
              spy={true}
              smooth={true}
              offset={-85}
              duration={500}
              className={navItemClass}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="contact-us"
              spy={true}
              smooth={true}
              offset={-115}
              duration={500}
              className={navItemClass}
            >
              Contact Us
            </Link>
          </li>
        </ul>

     
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/crowd-funding">
                <button onClick={onClick} className={`border border-green-400 px-4 py-2 text-lg font-semibold rounded-md bg-white text-green-700 hover:bg-green-700 hover:text-white transition duration-300`}>
                  Crowd Funding
                </button>
              </NavLink>
              <button onClick={handleLogout} className={buttonClass}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">
              <button onClick={onClick} className={buttonClass}>
                Log In
              </button>
            </NavLink>
          )}
        </div>
      </nav>
  
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link
                to="about-us"
                spy={true}
                smooth={true}
                offset={-85}
                duration={500}
                className={navItemClass}
                onClick={toggleMenu}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="contact-us"
                spy={true}
                smooth={true}
                offset={-115}
                duration={500}
                className={navItemClass}
                onClick={toggleMenu}
              >
                Contact Us
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <NavLink to="/crowd-funding">
                  <button
                    onClick={() => {
                      onClick();
                      toggleMenu();
                    }}
                    className={buttonClass}
                  >
                    Crowd Funding
                  </button>
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className={buttonClass}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login">
                <button
                  onClick={() => {
                    onClick();
                    toggleMenu();
                  }}
                  className={buttonClass}
                >
                  Log In
                </button>
              </NavLink>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
