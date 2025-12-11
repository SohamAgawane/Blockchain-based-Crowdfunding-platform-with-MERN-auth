import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { loader } from "../assets";
import FundCard from "../components/FundCard";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "education", label: "Education" },
  { key: "healthcare", label: "Healthcare" },
  { key: "environment", label: "Environment" },
  { key: "technology", label: "Technology" },
  { key: "other", label: "Other" },
];

const DisplayCampaigns = ({ title = "Campaigns", isLoading, campaigns = [], onClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortMode, setSortMode] = useState("newest");

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${encodeURIComponent(campaign.title)}`, { state: campaign });
  };

  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = campaigns.filter((campaign) => {
      const matchesSearch =
        !q ||
        (campaign.title && campaign.title.toLowerCase().includes(q)) ||
        (campaign.location && campaign.location.toLowerCase().includes(q)) ||
        (campaign.description && campaign.description.toLowerCase().includes(q));
      const matchesCategory = !selectedCategory || campaign.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortMode === "mostFunded") {
      list = list.sort((a, b) => (b.raised || 0) - (a.raised || 0));
    } else if (sortMode === "oldest") {
      list = list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else {
      list = list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [campaigns, searchQuery, selectedCategory, sortMode]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Transparent panel — will sit on page background */}
      <div className="bg-transparent rounded-2xl p-4 sm:p-6">
        {/* Controls row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          {/* Search + chips */}
          <div className="flex-1 min-w-0">
            <label htmlFor="campaign-search" className="sr-only">
              Search campaigns
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiSearch />
              </span>

              <input
                id="campaign-search"
                type="search"
                role="searchbox"
                aria-label="Search campaigns by title or location"
                placeholder="Search by project, city or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-3 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
              />
            </div>

            {/* chips below input (keeps compact spacing) */}
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = selectedCategory === c.key;
                return (
                  <button
                    key={c.key || "all"}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`text-sm px-3 py-1 rounded-full transition inline-flex items-center gap-2 ${active
                        ? "bg-gradient-to-r from-emerald-500 to-sky-400 text-white shadow"
                        : "bg-white/70 text-slate-700 border border-white/60 hover:bg-white"
                      }`}
                    aria-pressed={active}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort + filter summary */}
          {/* <div className="flex-shrink-0 w-full lg:w-auto flex items-center gap-3">
            <div className="hidden sm:block text-sm text-slate-600">Sort</div>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="newest">Newest</option>
              <option value="mostFunded">Most Funded</option>
              <option value="oldest">Oldest</option>
            </select>

            <div className="ml-2 text-sm text-slate-700">
              <span className="inline-block px-2 py-1 rounded-full bg-white/80 shadow-sm">
                {filteredCampaigns.length}
              </span>
            </div>
          </div> */}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent">
            {title}
          </h2>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/create-campaign")}
              className="px-5 py-2.5 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              <span className="text-lg">✦</span>
              Create Campaign
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <div className="col-span-full flex flex-col items-center py-8">
                <img src={loader} alt="loading" className="w-20 h-20 object-contain" />
                <p className="mt-4 text-sm text-slate-600">Loading campaigns…</p>
              </div>

              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse p-4 rounded-2xl bg-white/60 shadow-sm">
                  <div className="h-40 rounded-lg bg-slate-200 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </>
          ) : filteredCampaigns.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl bg-white/60 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaigns found</h3>
              <p className="text-sm text-slate-600 mb-4">
                Try another search or category, or be the first to launch a campaign.
              </p>
              <button
                onClick={() => navigate("/create-campaign")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white font-semibold shadow-md"
              >
                Create Campaign
              </button>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id || campaign.title}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl overflow-hidden"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/60 border border-transparent hover:border-emerald-100 transition shadow-sm">
                  <div className="p-4">
                    <FundCard
                      {...campaign}
                      handleClick={() => {
                        // navigate to campaign details only
                        handleNavigate(campaign);
                        // DO NOT call parent onClick here — it causes other navigation
                        // if (typeof onClick === "function") onClick(campaign); // <-- removed
                      }}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </motion.div>
            ))
            
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayCampaigns;
