
import React from "react";

import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";
import { GiPositionMarker } from "react-icons/gi";

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  category,
  location,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);

  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] border border-[#e0e0e0] bg-white shadow-lg hover:shadow-xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-full">
        <img
          src={image}
          alt="fund"
          className="w-full h-[158px] object-cover rounded-t-[15px]"
        />
        <div className="absolute top-4 left-4 flex items-center px-3 py-1 border rounded-lg bg-gray-100 border-green-400 ">
          <GiPositionMarker className="text-red-600 " />
          <p className="font-sans ml-2 font-medium text-[16px] text-blue-600">
            {location}
          </p>          
        </div>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#007bff]">
            Campaign belongs to : {category} <br />
          </p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-[#333] text-left leading-[26px] truncate">
            {title}
          </h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#555] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#007bff] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Raised of {target}
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#007bff] leading-[22px]">
              {remainingDays < 0 ? "0" : remainingDays}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#007bff]">
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#555] truncate">
            <span className="text-[#007bff]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
