

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { FaWhatsapp, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useStateContext } from "../context";
import { CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import { CountBox } from "../components";
import { LuBookmarkMinus } from "react-icons/lu";
import { LuBookmarkPlus } from "react-icons/lu";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    donate,
    getDonations,
    contract,
    address,
    getUserCampaigns,
    likeCampaign,
    getLikesAndDislikes,
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [donators, setDonators] = useState([]);
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchLikesAndDislikes = async () => {
      const data = await getLikesAndDislikes(state.pId);
      setLikes(data.likes);
    };

    fetchLikesAndDislikes();
  }, [state.pId, getLikesAndDislikes]);

  //console.log(state);

  const handleLike = async () => {
    try {
      await likeCampaign(state.pId);
      const data = await getLikesAndDislikes(state.pId);
      setLikes(data.likes);
      setError(""); // Clear previous errors
    } catch (err) {
      setError("You can only vote once for this campaign!");
    }
  };

  const fetchCampaigns = async () => {
    const data = await getUserCampaigns();
    setTotalCampaigns(data);
  };

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
      fetchDonators();
    }
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);
    await donate(state.pId, amount);
    navigate("/");
    setIsLoading(false);
  };

  const handleShare = (platform) => {
    const campaignURL = window.location.href; // Current page URL
    const message = `Check out this campaign: ${state.title} - ${campaignURL}`;

    // send to gmail
    const subject = "Check out this amazing campaign";
    const body =
      "Hi, I found this campaign interesting and thought you might like it too! Check it out here: [Insert Campaign Link]";
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (platform === "email") {
      window.open(gmailURL, "_blank");
    }
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem(address)) || [];
    setFavorites(storedFavorites);
  }, [address]);

  // Add campaign to favorites
  const addFavorite = (id) => {
    const updatedFavorites = [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem(address, JSON.stringify(updatedFavorites));
  };

  // Remove campaign from favorites
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(address, JSON.stringify(updatedFavorites));
  };

  // Check if campaign is in favorites
  const isFavorite = favorites.includes(state.pId);

  return (
    <div className="bg-white text-black">
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />

          <div className="relative w-full h-[12px] bg-[#d1e0f3] mt-2">
            <div
              className="absolute h-full bg-[#41ce6b]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox
            title="Days Left"
            value={remainingDays < 0 ? "0" : remainingDays}
          />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="flex flex-row justify-between px-2 items-center m-4 border bg-gray-200 border-gray-300 rounded-md">
        <div className="bg-white p-2 border border-none rounded-md">
          <span>Do vote to the Campaign : </span>
          <button onClick={handleLike}>👍 </button>{" "}
          <span className="ml-1">{likes}</span>
        </div>

        <div className="flex justify-between items-center bg-white p-2 border border-none rounded-md">
          <p className="text-[16px] mr-4 text-center ">
            Amount Collected : {calculateBarPercentage(
              state.target,
              state.amountCollected
            )}{" "}%
          </p>

        </div>

        <div>
          <div className="flex items-center mt-5">
            <p className="text-xl mr-4 text-center mb-5 font-semibold">
              Share via
            </p>

            <div
              className="group flex flex-col items-center cursor-pointer mt-4"
              onClick={() => handleShare("email")}
            >
              <FaEnvelope
                size={30}
                className="text-[#db635c] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="mt-2 text-sm text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Email
              </span>
            </div>

            <div
              className="group flex flex-col items-center cursor-pointer mt-4"
              onClick={() => handleShare("whatsapp")}
            >
              <FaWhatsapp
                size={30}
                className="text-[#25D366] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="mt-2 text-sm text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                WhatsApp
              </span>
            </div>

            <div
              className="group flex flex-col items-center cursor-pointer mt-4"
              onClick={() => handleShare("twitter")}
            >
              <FaTwitter
                size={30}
                className="text-[#1DA1F2] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="mt-2 mr-4 text-sm text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Twitter
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-row justify-between p-2 items-center m-4 border bg-gray-200 border-gray-300 rounded-md">
        <div className="flex justify-between items-center bg-white p-2 border border-none rounded-md">
          <p className="text-[16px] text-center ">
            Campaign belongs to : {state.category}
          </p>
        </div>

        <div className="flex justify-between items-center bg-white p-2 border border-none rounded-md">
          <p className="text-[16px] text-center ">
            Location : {state.location}
          </p>
        </div>

        <div>
          <button
            onClick={() =>
              isFavorite ? removeFavorite(state.pId) : addFavorite(state.pId)
            }
            style={{
              backgroundColor: isFavorite ? "gray" : "green",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {isFavorite ? (
              <div className="flex flex-row justify-center items-center">
                <p className="font-semibold text-black hover:text-white text-[16px]">
                  <LuBookmarkMinus />
                </p>
                <p className="font-semibold text-[16px] text-black ml-2">Remove Bookmark</p>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center">
                <p className="font-semibold hover:text-black text-[16px]">
                  <LuBookmarkPlus />
                </p>
                <p className="font-semibold text-[16px] ml-2">Add Bookmark</p>
              </div>
            )}
          </button>
        </div>

      </div>
      <hr />

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#dbe6fc] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] object-contain"
                />
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-black break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {totalCampaigns.length} Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#494a53] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Donators
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#494a53] leading-[26px] break-all">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#494a53] leading-[26px] break-all">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#494a53] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        {remainingDays < 0 ? (
          <div className="flex-1 text-justify p-3 bg-[#9fb8f1] rounded-[10px]">
            <h2 className="p-3 mb-4 text-center font-epilogue font-semibold text-[18px] text-black uppercase">
              Campaign is Closed!
            </h2>

            <h2 className="font-epilogue font-normal text-[16px] text-[#494a53]">
              "Thank you for your interest in our campaign. We wanted to inform
              you that the campaign has closed. We appreciate your participation
              and support. Stay tuned for future updates and opportunities. If
              you have any questions, feel free to reach out to us."
            </h2>

            <h2 className="mt-3 font-epilogue font-normal text-[16px] text-[#202025]">
              Thank you again for being a part of our community.
            </h2>
          </div>
        ) : (
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Fund
            </h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#dbe6fc] rounded-[10px]">
              <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#3b82f6]">
                Fund the Campaign
              </p>

              <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder="ETH 0.1"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3b82f6] bg-transparent font-epilogue text-black text-[18px] leading-[30px] placeholder:text-[#3b82f6] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className="my-[20px] p-4 bg-[#f0f4f9] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#3b82f6] leading-[22px]">
                    Back it because you believe in it.
                  </h4>

                  <p className="mt-[20px] font-epilogue font-normal text-[#808191] leading-[22px]">
                    Support the project for no reward, just because it speaks to
                    you.
                  </p>
                </div>

                <CustomButton
                  btnType="button"
                  title="Fund Campaign"
                  styles="w-full bg-[#3b82f6] text-white"
                  handleClick={handleDonate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
