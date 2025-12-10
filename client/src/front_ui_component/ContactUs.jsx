import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { contactImg } from "../assets";
import "./Contact.css";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../util";

const ContactUs = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const form = useRef();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_nq9vm4j", "template_91zwu1d", form.current, {
        publicKey: "fd-oX34Fs126AN4Eh",
      })
      .then(
        () => {
          handleSuccess("Message sent successfully.");
          e.target.reset();
      },
        () => {
          handleError("Failed to send message. Try again.");
        }
      );
  };

  return (
    <section id="contact-us" className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Heading */}
        <div className="mb-8 text-center space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
              Talk to the Pro Fund team.
            </span>
          </h2>
          <p className="text-sm sm:text-[0.95rem] text-slate-600 max-w-xl mx-auto">
            Have a campaign in mind, want to onboard your NGO, or explore an
            integration? Drop us a message and we’ll get back on your preferred rail.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-center">
          {/* FORM SIDE */}
          <div className="relative">
            {/* subtle gradient halo */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-300/25 via-emerald-300/20 to-indigo-300/25 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,23,42,0.12)] px-5 py-6 sm:px-7 sm:py-7">
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    type="text"
                    name="user_name"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Email
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    type="email"
                    name="user_email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 min-h-[140px] resize-none"
                    name="message"
                    placeholder="Tell us about your campaign, integration idea, or question."
                  />
                </div>

                {loggedInUser ? (
                  <input
                    className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
                    type="submit"
                    value="Send message"
                  />
                ) : (
                  <div className="mt-2 rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-center">
                    <p className="text-[13px] font-medium text-amber-800">
                      Please log in to send a message via the dashboard.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* IMAGE / INFO SIDE */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative w-full max-w-sm">
              {/* subtle floating glow */}
              <div className="pointer-events-none absolute -top-8 -right-4 h-32 w-32 rounded-full bg-sky-200/50 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/50 blur-3xl" />

              <div className="relative mx-auto flex items-center justify-center">
                <img
                  src={contactImg}
                  alt="Contact illustration"
                  className="w-full max-w-xs sm:max-w-sm drop-shadow-xl animate-moveUpDown"
                  style={{ animation: "moveUpDown 3s ease-in-out infinite" }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default ContactUs;
