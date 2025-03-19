import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { contactImg } from "../assets";
import "./Contact.css";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../util";

const ContactUs = () => {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_nq9vm4j", "template_91zwu1d", form.current, {
        publicKey: "fd-oX34Fs126AN4Eh",
      })
      .then(
        () => {
          handleSuccess("SUCCESS!");
          e.target.reset();
        },
        (error) => {
          handleError("FAILED...");
        }
      );
  };

  return (
    <div className="mx-auto max-w-7xl p-5">
      <div
        id="contact-us"
        className="flex mb-4 rounded-xl mx-auto bg-[#1c1c24] sm:p-6 flex-col md:flex-row md:gap-20 md:p-10"
        style={{
          backgroundImage: `linear-gradient(to right, #f78484, #5eea96)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src={contactImg}
            alt="Illustration"
            className="w-full lg:w-3/4 xl:w-4/5 scale-105 sm:p-2 md:scale-100 animate-moveUpDown"
            style={{
              animation: "moveUpDown 3s infinite",
            }}
          />
        </div>

        <div className="w-full lg:w-1/2 mt-10 md:mt-0 flex flex-col justify-center">
          <h1 className="text-xl font-bold text-gray-100 md:text-3xl lg:text-4xl">
            Get In Touch
          </h1>
          <form ref={form} onSubmit={sendEmail} className="mt-5 space-y-3">
            <label className="block">
              <span className="text-gray-950">Name:</span>
              <input
                className="mt-1 p-2 bg-transparent border-2 border-gray-200 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="text"
                name="user_name"
              />
            </label>
            <label className="block">
              <span className="text-gray-950">Email:</span>
              <input
                className="mt-1 p-2 bg-transparent border-2 border-gray-200 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="email"
                name="user_email"
              />
            </label>
            <label className="block">
              <span className="text-gray-950">Message:</span>
              <textarea
                className="mt-1 p-3 h-40 bg-transparent border-2 border-gray-200 block w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                name="message"
              ></textarea>
            </label>

            {loggedInUser ? (
              <>
                <input
                  className="py-2 text-lg font-semibold border border-transparent rounded-md bg-white text-green-700 hover:bg-green-700 hover:text-white transition duration-300 mt-1 block w-full px-3 shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="submit"
                  value="Send"
                />
              </>
            ) : (
              <div>
                <p className="text-black text-center text-lg font-semibold">
                  Please log-in first to access contact.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactUs;
