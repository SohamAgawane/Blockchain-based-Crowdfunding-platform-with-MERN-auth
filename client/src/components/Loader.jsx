import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-md flex items-center justify-center">
      {/* Outer fade animation */}
      <div className="flex flex-col items-center animate-fadeIn">

        {/* Modern Gradient Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-sky-400 animate-spin"></div>
        </div>

        {/* Label */}
        <p className="mt-5 text-slate-700 font-semibold text-lg text-center">
          Processing your transaction…
        </p>
        <p className="text-slate-500 text-sm text-center">
          Please wait a moment
        </p>
      </div>

      {/* custom animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Loader;
