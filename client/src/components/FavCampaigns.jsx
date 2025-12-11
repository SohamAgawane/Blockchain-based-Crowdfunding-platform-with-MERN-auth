import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loader } from "../assets";
import FundCard from "./FundCard";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "education", label: "Education" },
  { key: "healthcare", label: "Healthcare" },
  { key: "environment", label: "Environment" },
  { key: "technology", label: "Technology" },
  { key: "other", label: "Other" },
];

const FavCampaigns = ({ title = "Favorite Campaigns", isLoading = false, campaigns = [] }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${encodeURIComponent(campaign.title)}`, { state: campaign });
  };

  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (!c) return false;
      const matchesSearch =
        !q ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q));
      const matchesCategory = !selectedCategory || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [campaigns, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-transparent rounded-2xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent">
              {title} <span className="text-sm font-medium text-slate-500">({filteredCampaigns.length})</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">Campaigns you bookmarked — stay in touch with creators you love.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none w-full">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search favorites by title, location or keyword"
                className="w-full pl-4 pr-3 py-2 rounded-xl border border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <button
              onClick={() => navigate("/create-campaign")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white font-semibold shadow-md hover:opacity-95 transition"
            >
              Create Campaign
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = selectedCategory === c.key;
            return (
              <button
                key={c.key || "all"}
                onClick={() => setSelectedCategory(c.key)}
                className={`text-sm px-3 py-1 rounded-full transition inline-flex items-center gap-2 ${
                  active
                    ? "bg-gradient-to-r from-emerald-500 to-sky-400 text-white shadow"
                    : "bg-white/80 text-slate-700 border border-white/60 hover:bg-white"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <div className="col-span-full flex flex-col items-center py-8">
                <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
                <p className="mt-4 text-sm text-slate-600">Loading favorites…</p>
              </div>

              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`sk-${i}`} className="animate-pulse rounded-2xl overflow-hidden bg-white/30 backdrop-blur-sm shadow-sm">
                  <div className="h-40 bg-slate-200 mb-4" />
                  <div className="p-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : filteredCampaigns.length === 0 ? (
            <div className="col-span-full p-8 rounded-2xl bg-white/20 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No favorites yet</h3>
              <p className="text-sm text-slate-600 mb-4">You haven't bookmarked campaigns — explore and add your favorites.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/crowd-funding")}
                  className="px-4 py-2 rounded-full bg-white/90 text-emerald-600 border border-emerald-200 shadow-sm"
                >
                  Browse Campaigns
                </button>
                <button
                  onClick={() => navigate("/create-campaign")}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white shadow-md"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id || campaign.title}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl overflow-hidden"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/60 border border-transparent hover:border-emerald-100 transition shadow-sm h-full flex flex-col">
                  <div className="p-4 flex-1 flex flex-col">
                    <FundCard
                      {...campaign}
                      handleClick={() => handleNavigate(campaign)}
                      className="h-full"
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

export default FavCampaigns;
