import React, { useState, useEffect, useCallback } from "react";
import DisplayCampaigns from "../components/DisplayCampaigns";
import FavCampaigns from "../components/FavCampaigns";
import { useStateContext } from "../context";

/**
 * Profile.jsx
 * - Fetches all campaigns, user's campaigns
 * - Loads favorites from localStorage under `favorites_${address}`
 * - Normalizes ID types (string) when comparing
 * - Defensive: try/catch, mounted flag to avoid setState after unmount
 */

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [favoriteCampaigns, setFavoriteCampaigns] = useState([]);

  const { address, contract, getUserCampaigns, getCampaigns } = useStateContext();

  // fetch all campaigns (global)
  const fetchAllCampaigns = useCallback(async () => {
    if (typeof getCampaigns !== "function") {
      setAllCampaigns([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      setAllCampaigns(data || []);
    } catch (err) {
      console.error("fetchAllCampaigns error:", err);
      setAllCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [getCampaigns]);

  // fetch campaigns created by the user
  const fetchUserCampaigns = useCallback(async () => {
    if (typeof getUserCampaigns !== "function") {
      setUserCampaigns([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getUserCampaigns();
      setUserCampaigns(data || []);
    } catch (err) {
      console.error("fetchUserCampaigns error:", err);
      setUserCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, [getUserCampaigns]);

  // Read favorites from localStorage and map to campaign objects
  const fetchFavoriteCampaigns = useCallback(() => {
    if (!address) {
      setFavoriteCampaigns([]);
      return;
    }

    // use a single consistent key
    const storedRaw = localStorage.getItem(`favorites_${address}`);
    let storedFavorites = [];
    try {
      storedFavorites = storedRaw ? JSON.parse(storedRaw) : [];
      if (!Array.isArray(storedFavorites)) storedFavorites = [];
    } catch (e) {
      console.warn("Failed to parse favorites from localStorage:", e);
      storedFavorites = [];
    }

    // Normalize as strings for comparison (covers numbers or strings)
    const favoriteIds = storedFavorites.map((id) => String(id));

    // Filter allCampaigns for those with matching pId
    const favorites = allCampaigns.filter((campaign) => {
      // fallback keys: prefer pId, then id, then campaignId
      const pid = campaign?.pId ?? campaign?.id ?? campaign?.campaignId;
      return favoriteIds.includes(String(pid));
    });

    setFavoriteCampaigns(favorites);
  }, [address, allCampaigns]);

  // Remove campaign from favorites (updates localStorage and local state)
  const removeFavoriteCampaign = (campaignId) => {
    if (!address) return;
    const key = `favorites_${address}`;
    let storedFavorites = [];
    try {
      storedFavorites = JSON.parse(localStorage.getItem(key)) || [];
      if (!Array.isArray(storedFavorites)) storedFavorites = [];
    } catch (e) {
      storedFavorites = [];
    }

    const idStr = String(campaignId);
    const updated = storedFavorites.filter((id) => String(id) !== idStr);
    localStorage.setItem(key, JSON.stringify(updated));

    // Immediately update favoriteCampaigns state without refetching allCampaigns
    setFavoriteCampaigns((prev) => prev.filter((c) => String(c?.pId ?? c?.id ?? c?.campaignId) !== idStr));
  };

  // fetch on mount / when contract changes
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!contract) return;
      if (!mounted) return;
      // fetch both lists in parallel
      setIsLoading(true);
      try {
        await Promise.allSettled([fetchAllCampaigns(), fetchUserCampaigns()]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [contract, fetchAllCampaigns, fetchUserCampaigns]);

  // update favorites whenever allCampaigns or address changes
  useEffect(() => {
    fetchFavoriteCampaigns();
  }, [allCampaigns, address, fetchFavoriteCampaigns]);

  return (
    <div className="space-y-8">
      <DisplayCampaigns title="All Your Campaigns" isLoading={isLoading} campaigns={userCampaigns} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Your Favorite Campaigns ({favoriteCampaigns.length})</h2>
          {/* optional clear all favorites */}
          {favoriteCampaigns.length > 0 && (
            <button
              onClick={() => {
                if (!address) return;
                localStorage.removeItem(`favorites_${address}`);
                setFavoriteCampaigns([]);
              }}
              className="text-sm text-emerald-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {favoriteCampaigns.length > 0 ? (
          <FavCampaigns title="Your Favorite Campaigns" isLoading={isLoading} campaigns={favoriteCampaigns} onRemove={removeFavoriteCampaign} />
        ) : (
          <div className="p-4 rounded-lg bg-white/40">
            <p className="text-sm text-slate-600">You have not favorited any campaigns yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
