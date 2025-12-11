import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Header from "./Header";
import Features from "./Features.jsx";
import { motion } from "framer-motion";

const Home = ({ onClick, isAuthenticated }) => {
  const handlePrimaryCta = () => {
    if (onClick) onClick();
  };

  const Capsule = (text) => (
    <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/95 px-3 py-1 shadow-sm backdrop-blur">
      <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent text-[10px] font-medium text-center whitespace-nowrap">
        {text}
      </span>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
        {/* Floating header */}
        <Header onClick={onClick} isAuthenticated={isAuthenticated} />

        {/* PAGE SHELL */}
        <main
          id="home"
          className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-16 pt-24 sm:px-6 lg:px-8 sm:pt-28"
        >
          {/* HERO + DASHBOARD PREVIEW */}
          <section className="grid gap-10 lg:grid-cols-[3fr,2.5fr] lg:items-center">
            {/* LEFT: Short messaging */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Transparent, non-custodial crowdfunding on-chain
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                  A modern platform for
                  <span className="block pb-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
                    blockchain-based funding.
                  </span>
                </h1>
                <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600">
                  Launch and track campaigns from a single, focused interface.
                  No noise, just the essentials - unlocked when you connect.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePrimaryCta}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                >
                  {isAuthenticated ? "Open Dashboard" : "Connect Wallet"}
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById("about-us");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  See how it works
                </button>
              </div>

              {/* Chips row */}
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Smart-contract based
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Campaign flow visibility
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Built for web3 teams
                </span>
              </div>
            </div>

            {/* RIGHT: Visual protocol diagram */}
            <div className="relative flex justify-center">
              <motion.div
                className="relative h-72 sm:h-80 lg:h-96 w-full max-w-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* GRAPH ZONE */}
                <div className="relative h-full w-full">
                  <svg
                    viewBox="0 0 320 180"
                    className="h-full w-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      {/* Line gradient */}
                      <linearGradient id="pf-line" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>

                      {/* Area glow */}
                      <linearGradient id="pf-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(56,189,248,0.45)" />
                        <stop offset="50%" stopColor="rgba(34,197,94,0.20)" />
                        <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                      </linearGradient>

                      {/* soft glow blur */}
                      <filter id="softGlow">
                        <feGaussianBlur stdDeviation="2.4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* subtle waves grid */}
                    <g
                      stroke="#e5e7eb"
                      strokeDasharray="3 10"
                      strokeWidth="0.4"
                    >
                      <line x1="0" y1="50" x2="320" y2="50" />
                      <line x1="0" y1="95" x2="320" y2="95" />
                      <line x1="0" y1="140" x2="320" y2="140" />
                    </g>

                    {/* area glow */}
                    <path
                      d="
            M 0 132
            C 45 110, 75 90, 112 96
            C 140 101, 165 78, 200 86
            C 235 95, 255 70, 285 78
            C 305 82, 320 70, 320 70
            L 320 180
            L 0 180
            Z
          "
                      fill="url(#pf-area)"
                    />

                    {/* main blockchain flow line */}
                    <path
                      d="
            M 0 132
            C 45 110, 75 90, 112 96
            C 140 101, 165 78, 200 86
            C 235 95, 255 70, 285 78
            C 305 82, 320 70, 320 70
          "
                      fill="none"
                      stroke="url(#pf-line)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      filter="url(#softGlow)"
                    />
                  </svg>

                  {/* CAPSULE INSIGHTS */}
                  {/* Top */}
                  <motion.div
                    className="absolute left-1/2 top-2 -translate-x-1/2"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                  >
                    {Capsule("On-chain Liquidity Sync")}
                  </motion.div>

                  {/* Bottom */}
                  <motion.div
                    className="absolute left-1/2 bottom-2 -translate-x-1/2"
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
                  >
                    {Capsule("Stable Protocol Rails")}
                  </motion.div>

                  {/* Left Upper */}
                  <motion.div
                    className="absolute left-2 top-[38%]"
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
                  >
                    {Capsule("Recurring Backers")}
                  </motion.div>

                  {/* Right Center */}
                  <motion.div
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, repeatType: "mirror" }}
                  >
                    {Capsule("Smart-Contract Dampening")}
                  </motion.div>
                </div>
              </motion.div>
            </div>


          </section>

          {/* FEATURES SECTION */}
          <section className="space-y-6">
            <div className="
    rounded-3xl
    
    backdrop-blur-md
    bg-transparent
    p-6 sm:p-8
  ">
              <Features />
            </div>
          </section>


          {/* ABOUT SECTION */}
          <section id="about-us" className="space-y-6">
            <div className="
    rounded-3xl
    backdrop-blur-md
    bg-transparent
    p-6 sm:p-8
  ">
              <AboutUs />
            </div>
          </section>


          {/* CONTACT SECTION */}
          <section id="contact-us" className="space-y-6">
            <div className="
    rounded-3xl
    backdrop-blur-md
    bg-transparent
    p-6 sm:p-8
  ">
              <ContactUs />
            </div>
          </section>

        </main>
      </div>
    </Router>
  );
};

export default Home;
