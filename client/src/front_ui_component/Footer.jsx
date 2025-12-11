import React from "react";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-slate-400/70 bg-transparent">
      {/* soft gradient glow */}
      <div className="pointer-events-none absolute -top-16 inset-x-0 h-24 bg-gradient-to-r from-sky-200/40 via-emerald-200/30 to-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6 text-center">

          {/* Brand */}
          {/* <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500 bg-clip-text text-transparent">
                PRO FUND
              </span>
            </h2>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              A blockchain-native crowdfunding protocol built for transparent,
              impact-first funding.
            </p>
          </div> */}

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a
              href="#home"
              className="text-slate-600 hover:text-sky-600 transition"
            >
              Home
            </a>

            <a
              href="#about-us"
              className="text-slate-600 hover:text-emerald-600 transition"
            >
              About
            </a>

            <a
              href="#contact-us"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              Contact
            </a>
          </div>

          {/* Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-sky-400/40 via-emerald-400/40 to-indigo-400/40" />

          {/* Bottom line */}
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Pro Fund • Soham Agawane
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
