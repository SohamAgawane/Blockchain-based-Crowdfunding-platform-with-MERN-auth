import React, { useState, useEffect } from "react";
import DisplayCampaigns from "../components/DisplayCampaigns";
import FavCampaigns from "../components/FavCampaigns";
import { useStateContext } from "../context";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [favoriteCampaigns, setFavoriteCampaigns] = useState([]);
  const { address, contract, getUserCampaigns, getCampaigns } = useStateContext();

  // Fetch all campaigns created by the user
  const fetchAllCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setAllCampaigns(data);
    setIsLoading(false);
  };

  const fetchUserCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setUserCampaigns(data);
    setIsLoading(false);
  };

  // Fetch favorite campaigns from localStorage
  const fetchFavoriteCampaigns = () => {
    const storedFavorites = JSON.parse(localStorage.getItem(address)) || [];

    console.log("Stored Favorites:", storedFavorites);
    console.log("Stored Favorites Type:", typeof storedFavorites[0]);
    console.log("campaigns:", allCampaigns);
    const favorites = allCampaigns.filter((campaign) => {
      console.log("Campaign ID:", campaign.pId);
      console.log("Campaign Type:", typeof campaign.pId);
      return storedFavorites.includes(campaign.pId);
    });
    console.log("favorites ", favorites);
    setFavoriteCampaigns(favorites);
  };

  // Remove campaign from favorites
  const removeFavoriteCampaign = (campaignId) => {
    const storedFavorites =
      JSON.parse(localStorage.getItem(`favorites_${address}`)) || [];
    const updatedFavorites = storedFavorites.filter((id) => id !== campaignId);
    localStorage.setItem(
      `favorites_${address}`,
      JSON.stringify(updatedFavorites)
    );
    fetchFavoriteCampaigns(); // Update favorites immediately
  };

  useEffect(() => {
    if (contract) {
      fetchAllCampaigns();
      fetchUserCampaigns();
    }
  }, [address, contract]);

  useEffect(() => {
    fetchFavoriteCampaigns();
  }, [allCampaigns, address]);

  console.log(favoriteCampaigns);

  return (
    <div>
      <DisplayCampaigns
        title="All Your Campaigns"
        isLoading={isLoading}
        campaigns={userCampaigns}
      />

      <div className="mt-3">
        <h1 className="font-epilogue font-semibold text-[18px] text-black text-left">
          Your Favorite Campaigns ({favoriteCampaigns.length})
        </h1>
        {favoriteCampaigns.length > 0 ? (
          <FavCampaigns
            title="Your Favorite Campaigns"
            isLoading={isLoading}
            campaigns={favoriteCampaigns}
          />
        ) : (
          <p>You have not favorited any campaigns yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
