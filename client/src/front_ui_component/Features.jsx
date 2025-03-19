import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { meter1, meter2, meter3 } from "../assets";
import { BackGroundLeft } from "../assets";

const Features = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="bg-[#ffffff] p-5">
      <div className="max-w-7xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div
          className="bg-[#274d30] p-5"
          style={{
            backgroundImage: `url(${BackGroundLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="font-bold text-white text-center text-5xl mb-6 overflow-hidden">
            <span
              className="inline-block"
              style={{
                animation: "2s steps(30, end) infinite",
                whiteSpace: "nowrap",
              }}
            >
              Features
            </span>
          </h2>

          <p className="text-lg text-white text-center mb-8">
            Blockchain crowdfunding enhances security and transparency through
            decentralization. Smart contracts automate transactions, reducing
            fraud risks by minimizing intermediaries. Participants can verify
            fund allocation and project progress in real-time on the immutable
            blockchain ledger, fostering trust and accountability.
          </p>
          <p className="text-white text-xl text-center mb-8">
            Let us make this world a better place to live together.
          </p>
        </div>
        <div
          className="bg-[#274d30]  p-6"
          style={{
            backgroundImage: `url(${BackGroundLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Carousel
            responsive={responsive}
            infinite={true}
            arrows={false}
            autoPlay={true}
            className="pointer-events-none"
            onMouseEnter={() =>
              document
                .querySelector(".carousel")
                .classList.remove("pointer-events-none")
            }
            onMouseLeave={() =>
              document
                .querySelector(".carousel")
                .classList.add("pointer-events-none")
            }
          >
            <div className="text-center">
              <img src={meter1} alt="Decentralization" className="mx-auto" />
              <h5 className="font-bold text-2xl text-white mt-3">
                Decentralization
              </h5>
            </div>

            <div className="text-center">
              <img src={meter2} alt="Transparency" className="mx-auto" />
              <h5 className="font-bold text-2xl text-white mt-3">
                Transparency
              </h5>
            </div>

            <div className="text-center">
              <img src={meter3} alt="Easy Transfer" className="mx-auto" />
              <h5 className="font-bold text-2xl text-white mt-3">
                Easy Transfer
              </h5>
            </div>

            <div className="text-center">
              <img src={meter2} alt="Security" className="mx-auto" />
              <h5 className="font-bold text-2xl text-white mt-3">Security</h5>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Features;
