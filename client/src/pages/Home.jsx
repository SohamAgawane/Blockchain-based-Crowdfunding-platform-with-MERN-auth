import React, { useState, useEffect } from "react";

import DisplayCampaigns from "../components/DisplayCampaigns";
import { useStateContext } from "../context";

const Home = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    if (typeof getCampaigns !== "function") {
      console.warn("getCampaigns is not available from context");
      setCampaigns([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getCampaigns();
      setCampaigns(data || []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    // guard: only fetch when contract exists and component still mounted
    const run = async () => {
      if (!contract) return;
      if (!mounted) return;
      setIsLoading(true);
      try {
        if (typeof getCampaigns === "function") {
          const data = await getCampaigns();
          if (mounted) setCampaigns(data || []);
        } else {
          setCampaigns([]);
        }
      } catch (err) {
        console.error("fetchCampaigns error:", err);
        if (mounted) setCampaigns([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
    // intentionally depend on contract and address only
  }, [address, contract, getCampaigns]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      onClick={onClick}
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
