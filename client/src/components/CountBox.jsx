import React from "react";

const CountBox = ({ title, value }) => {
  return (
    <div
      className="w-full rounded-2xl backdrop-blur-md border border-white/40 
                 shadow-sm hover:shadow-md transition-all flex flex-col items-center p-4"
    >
      {/* VALUE */}
      <div
        className="w-full text-center py-3 px-4 rounded-xl text-white font-extrabold text-2xl
                   bg-gradient-to-r from-emerald-500 to-sky-400 shadow-md"
      >
        {value}
      </div>

      {/* TITLE */}
      <p className="mt-3 text-sm font-semibold text-slate-700 tracking-wide text-center">
        {title}
      </p>
    </div>
  );
};

export default CountBox;
