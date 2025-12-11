import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStateContext } from "./context";
import { CampaignDetails, CreateCampaign, Profile, Home } from "./pages";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import RefreshHandler from "./RefreshHandler";

const App = ({ onClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      setCampaigns(data || []);
    } catch (err) {
      console.error("fetchCampaigns error:", err);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  // ProtectedRoutes wrapper component
  const ProtectedRoutes = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  const buttonClass =
    "px-4 py-2 text-lg font-semibold border border-green-400 rounded-md bg-white text-[#047857] hover:bg-green-700 hover:text-white transition duration-300";

  return (
    <div className="relative sm:p-8 p-4 bg-white min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        {/* Sidebar could be enabled here */}
        {/* <Sidebar /> */}

        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

        <Routes>
          {/* Root -> redirect to your main landing */}
          <Route path="/" element={<Navigate to="/crowd-funding" replace />} />

          {/* Public routes */}
          <Route path="/crowd-funding" element={<Home onClick={onClick} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoutes element={<Home />} />} />
          <Route path="/profile" element={<ProtectedRoutes element={<Profile />} />} />

          {/* Create campaign (public or protected depending on your app logic) */}
          <Route path="/create-campaign" element={<CreateCampaign />} />

          {/* Campaign details — use :title param to match navigate() calls that use campaign.title
              If you prefer to use an id or slug, keep both code & route consistent. */}
          <Route path="/campaign-details/:title" element={<CampaignDetails />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/crowd-funding" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
