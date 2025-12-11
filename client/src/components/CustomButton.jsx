import React from "react";

const CustomButton = ({ btnType = "button", title, handleClick, styles = "" }) => {
  return (
    <button
      type={btnType}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center
        font-semibold text-[16px] px-5 py-3 rounded-xl
        transition-all duration-200 select-none
        bg-gradient-to-r from-emerald-500 to-sky-500 text-white
        shadow-md hover:shadow-lg hover:scale-[1.02]
        active:scale-[0.98]
        ${styles}
      `}
    >
      {title}
    </button>
  );
};

export default CustomButton;
