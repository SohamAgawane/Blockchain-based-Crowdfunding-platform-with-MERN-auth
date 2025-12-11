import React from "react";
import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";
import { GiPositionMarker } from "react-icons/gi";
import { SiEthereum } from "react-icons/si";

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

  // Convert to numeric safely (crypto amount)
  const toNum = (v) => {
    if (!v) return 0;
    const n = parseFloat(String(v).replace(/[^0-9.\-]+/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const raised = toNum(amountCollected);
  const goal = toNum(target);

  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  // styling for days left
  const daysBadge =
    remainingDays < 0
      ? "bg-red-50 text-red-600"
      : remainingDays <= 3
      ? "bg-amber-50 text-amber-600"
      : "bg-emerald-50 text-emerald-600";

  return (
    <div
      onClick={handleClick}
      className="w-full sm:w-[320px] rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border border-transparent"
    >
      {/* Image + top badges */}
      <div className="relative w-full h-[170px] bg-slate-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Location badge */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-white/40">
          <GiPositionMarker className="text-red-500" />
          <span className="text-xs font-medium text-slate-700">{location}</span>
        </div>

        {/* Days left badge */}
        <div
          className={`absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-semibold border border-white/40 ${daysBadge}`}
        >
          {remainingDays < 0 ? "Ended" : `${remainingDays}d left`}
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category + Chain */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={tagType} alt="tag" className="w-5 h-5" />
            <span className="text-xs text-slate-500">Category:</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-sky-100 text-emerald-700">
              {category || "Other"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <SiEthereum className="text-emerald-500" />
            ETH
          </div>
        </div>

        {/* Title + Description */}
        <div>
          <h3 className="font-semibold text-slate-900 truncate">{title}</h3>
          <p className="text-sm text-slate-600 line-clamp-2 mt-1">{description}</p>
        </div>

        {/* Progress Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-emerald-600">{raised}</p>
              <p className="text-xs text-slate-500">Raised of {goal}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">{percent}%</p>
              <p className="text-xs text-slate-500">Funded</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all duration-500"
            ></div>
          </div>
        </div>

        {/* Owner Section */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <img src={thirdweb} alt="owner" className="w-6 h-6 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{owner}</p>
              <p className="text-xs text-slate-500">Organizer</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
