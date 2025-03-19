
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loader } from "../assets";
import FundCard from "../components/FundCard";

const DisplayCampaigns = ({ title, isLoading, campaigns, onClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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
      <div className="flex flex-col sm:flex-row mb-4 p-2 items-center justify-between gap-4">
        <div className="w-full sm:w-2/3">
        <label
            htmlFor="tile"
            className="block text-sm font-medium text-black mb-1"
          >
            Search Campaigns by Title, Location
          </label>        
          <input
            type="text"
            placeholder="Search campaigns by title or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7ff675]"
          />
        </div>

        <div className="w-full sm:w-1/3">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-black mb-1"
          >
            Filter by Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#7ff675]"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="environment">Environment</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <h1 className="font-epilogue font-semibold text-[18px] text-black text-left">
        {title} ({filteredCampaigns.length})
      </h1>

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

export default DisplayCampaigns;
