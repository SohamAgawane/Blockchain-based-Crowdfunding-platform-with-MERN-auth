import React from "react";

const Footer = () => {
  return (

    
    <footer className="bg-white text-[#000] px-8 py-4 relative">
      <hr/>
      <div className="container flex flex-col justify-center items-center mx-auto relative z-10 text-white">
        <div className="sm:flex sm:justify-between sm:mx-10">
          <div className="text-center text-[#000] sm:text-left py-4 sm:py-0">
            <h2 className="text-2xl p-3 text-center font-semibold">PRO FUND</h2>
            <p className=" text-md">
              We are a crowdfunding platform with a vision to create a social
              impact.
            </p>
            <p className="text-center text-sm">
              Let us make this world a better place to live together.
            </p>
          </div>
        </div>
        <div className="m-5 text-center cursor-pointer">
          <a className="text-green-500 font-semibold text-md mr-2 hover:text-blue-500">Home</a>
          <a className="text-green-500 font-semibold text-md mr-2 hover:text-blue-500">About Us</a>
          <a className="text-green-500 font-semibold text-md mr-2 hover:text-blue-500">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
