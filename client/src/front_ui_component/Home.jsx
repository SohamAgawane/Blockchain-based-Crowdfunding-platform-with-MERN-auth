
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Header from "./Header";
import Features from "./Features.jsx";

const Home = ({ onClick, isAuthenticated }) => {
  return (
    <Router>
      <div id="home" className="bg-white text-blue-900 font-sans min-h-screen">
        <Header onClick={onClick} isAuthenticated={isAuthenticated} />
        <div className="mt-20">
          <section className="bg-white text-black text-center py-20">
            <div className="container mx-auto px-6">
              <h1
                className="text-6xl font-extrabold mb-4"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  borderRight: "2px solid black",
                  width: "fit-content",
                  margin: "0 auto",
                  animation:
                    "typing 4s steps(40, end), blink 0.75s step-end infinite",
                }}
              >
                Welcome to Pro Fund
              </h1>
              <p
                className="text-lg max-w-2xl mx-auto leading-relaxed mt-4"
                style={{ animation: "fadeIn 2s ease-in forwards", opacity: 0 }}
              >
                A platform for changemakers with the will to make a difference
                in the world or in the lives of people who deserve better.
              </p>
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <Features />
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <AboutUs />
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <ContactUs />
            </div>
          </section>
        </div>
      </div>
    </Router>
  );
};

export default Home;
