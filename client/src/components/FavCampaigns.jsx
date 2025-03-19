import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loader } from "../assets";
import FundCard from "./FundCard";

const FavCampaigns = ({ title, isLoading, campaigns, onClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearchQuery =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || campaign.category === selectedCategory;
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="bg-white">

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <div className="flex flex-col justify-center items-center">
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain"
            />
            <p className="mt-[20px] font-epilogue font-bold text-[20px] text-black text-center">
              Wait a while, campaigns are loading <br /> Please wait...
            </p>
          </div>
        )}

        {!isLoading && filteredCampaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns match your search query.
          </p>
        )}

        {!isLoading &&
          filteredCampaigns.length > 0 &&
          filteredCampaigns.map((campaign) => (
            <FundCard
              key={campaign.id}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default FavCampaigns;
