import React, { useState, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { useStateContext } from "./context";
import { CampaignDetails, CreateCampaign, Profile, Home } from "./pages";
import { Sidebar } from "./components";
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
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  const ProtectedRoutes = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const buttonClass =
    "px-4 py-2 text-lg font-semibold border border-green-400 rounded-md bg-white text-[#047857] hover:bg-green-700 hover:text-white transition duration-300";

  return (
    <div className="relative sm:p-8 p-4 bg-white min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Sidebar />

        <div className="flex mb-4 p-2 flex-row justify-center items-center">    
          <button className={buttonClass} onClick={onClick}>
            Go To the Dashboard
          </button>
        </div>

        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/crowd-funding" element={<Home onClick={onClick} />} />
          <Route
            path="/signup"
            setIsAuthenticated={setIsAuthenticated}
            element={<Signup to="/signup" />}
          />
          <Route
            path="/login"
            setIsAuthenticated={setIsAuthenticated}
            element={<Login to="/login" />}
          />

          <Route
            path="/home"
            element={<ProtectedRoutes element={<Home />} />}
          />

          <Route
            path="/profile"
            element={<ProtectedRoutes element={<Profile />} />}
          />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  );
};
export default App;
