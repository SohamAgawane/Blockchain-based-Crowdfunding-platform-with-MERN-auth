
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navlinks } from "../constants";

import { useStateContext } from "../context";
import { CustomButton } from "./";
import { menu } from "../assets";

const Icon = ({ name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`flex items-center justify-center h-[48px] px-4 cursor-pointer transition-colors ${
      isActive && isActive === name
        ? "bg-[#047857] text-lg rounded-md text-white"
        : "text-green-700 hover:bg-[#047857] hover:text-white"
    } ${!disabled ? "" : "opacity-50 pointer-events-none"}`}
    onClick={handleClick}
  >
    <img
      src={imgUrl}
      alt="fund_logo"
      className={`w-6 h-6 ${isActive !== name ? "grayscale" : ""}`}
    />
    <span className="ml-2">{name}</span>
  </div>
);

const TopNavBar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const { connect, address } = useStateContext();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const getUserInitials = (name) => {
    if (name) {
      const nameParts = name.split(" ");
      const initials = nameParts
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");
      return initials;
    }
    return "";
  };

  return (
    <div className="flex top-0 w-full justify-between items-center bg-white text-green-700 py-4 px-8 shadow-md">
      <Link
        to="/home"
        className="text-green-700 cursor-pointer w-fit rounded-md text-3xl font-bold"
      >
        PRO FUND
      </Link>

      {loggedInUser && loggedInUser.length > 0 ? (
        <>
          <div className="hidden md:flex items-center">
            {navlinks.map((link) => (
              <Icon
                key={link.name}
                {...link}
                isActive={isActive}
                handleClick={() => {
                  if (!link.disabled) {
                    setIsActive(link.name);
                    navigate(link.link);
                  }
                }}
              />
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <img
              src={menu}
              alt="menu"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setToggleDrawer((prev) => !prev)}
            />
          </div>

          <div
            className={`md:hidden fixed inset-0 bg-[#c9cace] text-white py-4 px-8 z-50 transition-transform duration-300 ${
              toggleDrawer ? "" : "translate-x-full"
            }`}
          >
            <div className="flex justify-end mb-4">
              <img
                src={menu}
                alt="menu"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setToggleDrawer(false)}
              />
            </div>
            <ul className="mb-4">
              {navlinks.map((link) => (
                <li
                  key={link.name}
                  className={`flex p-4 ${
                    isActive === link.name && "bg-[#047857]"
                  }`}
                  onClick={() => {
                    setIsActive(link.name);
                    setToggleDrawer(false);
                    navigate(link.link);
                  }}
                >
                  <img
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[24px] h-[24px] object-contain ${
                      isActive === link.name ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  <p
                    className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                      isActive === link.name
                        ? "text-green-700"
                        : "text-[#047857]"
                    }`}
                  >
                    {link.name}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex mx-4">
              <CustomButton
                btnType="button"
                title={address ? "Create a campaign" : "Connect"}
                styles={address ? "bg-[#1dc071] " : "bg-[#8c6dfd]"}
                handleClick={() => {
                  if (address) navigate("create-campaign");
                  else connect();
                }}
              />
            </div>
          </div>

          <div className="hidden md:flex flex-row justify-end gap-4">
            <CustomButton
              btnType="button"
              title={address ? "Create a campaign" : "Connect"}
              styles={
                address
                  ? "px-4 py-2 text-lg font-semibold border border-green-400 rounded-md bg-white text-[#047857]  hover:bg-green-700 hover:text-white transition duration-300"
                  : "px-4 py-2 text-lg font-semibold border border-green-400 rounded-md bg-white text-[#047857] hover:bg-green-700 hover:text-white transition duration-300"
              }
              handleClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            />

            <Link to="/profile">
              <div className="w-[52px] h-[52px] rounded-full bg-[#03b300] flex justify-center items-center cursor-pointer">
                <span className="text-white text-lg font-semibold">
                  {getUserInitials(loggedInUser)}
                </span>
              </div>
            </Link>
          </div>
        </>
      ) : (
        <div>
          <p className="text-green-600">Please log in to access navigation.</p>
        </div>
      )}
    </div>
  );
};

export default TopNavBar;
