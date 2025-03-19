import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x7F601D3306fcf09ccD9C009543eE428f3f79c4D1"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, //owner
          form.title, // title
          form.description, // description
          form.target, // target amount
          new Date(form.deadline).getTime(), // deadline
          form.category,
          form.location,
          form.image, // image
        ],
      });
      console.log("contract call success ", data);
    } catch (error) {
      console.log("contract call failed ", error);
    }
  };

  // get the campaigns
  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      category:campaign.category,
      location:campaign.location,
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const likeCampaign = async (pId) => {
    try {
      const data = await contract.call("likeCampaign", [pId]);
      console.log(`Liked campaign ${pId}`, data);
      return data;
    } catch (error) {
      console.error("Failed to like the campaign:", error);
      return null;
    }
  };

  const dislikeCampaign = async (pId) => {
    try {
      const data = await contract.call("dislikeCampaign", [pId]);
      console.log(`Disliked campaign ${pId}`, data);
      return data;
    } catch (error) {
      console.error("Failed to dislike the campaign:", error);
      return null;
    }
  };

  const getLikesAndDislikes = async (pId) => {
    try {
      const data = await contract.call("getLikesAndDislikes", [pId]);
      return {
        likes: data[0].toNumber(),
        dislikes: data[1].toNumber(),
      };
    } catch (error) {
      console.error("Failed to get likes and dislikes:", error);
      return { likes: 0, dislikes: 0 };
    }
  };

  const bookmarkCampaign = async (pId) => {
    try {
      const bookmarks = await getBookmarks();
      if (bookmarks.includes(pId)) {
        console.log("Campaign is already bookmarked");
        return;
      }
      const data = await contract.call("bookmarkCampaign", [pId]);
      console.log(`Bookmarked campaign ${pId}`, data);
      return data;
    } catch (error) {
      console.error("Failed to bookmark the campaign:", error);
      return null;
    }
  };
  

  const getBookmarks = async () => {
    try {
      const data = await contract.call("getBookmarks", [address]);
      console.log("Retrieved bookmarks:", data);
      return data;
    } catch (error) {
      console.error("Failed to retrieve bookmarks:", error);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        likeCampaign,
        dislikeCampaign, 
        getLikesAndDislikes,
        bookmarkCampaign,
        getBookmarks
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
