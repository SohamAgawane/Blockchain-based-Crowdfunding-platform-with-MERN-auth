import React from "react";

const AboutUs = () => {
  return (
    <div
      id="about-us"
      className="max-w-7xl mx-auto text-white py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl font-sans p-8 border-1 border-none bg-slate-700">
        <div className="max-w-3xl font-sans  mx-auto">
          <h1 className="text-5xl text-center font-bold mb-7">About Us</h1>
          <p className="text-xl text-center leading-relaxed">
            We are a crowdfunding platform with a vision to create a social
            impact. Our unique model allows people from across the globe to
            donate towards raising funds using cryptocurrency for products
            required by NGOs and charities in India, which are then delivered to
            them directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
