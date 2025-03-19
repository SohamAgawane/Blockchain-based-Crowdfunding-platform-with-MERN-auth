import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import App from "./App";
import { StateContextProvider } from "./context";
import "./index.css";
import Footer from "./front_ui_component/Footer";
import Home from "./front_ui_component/Home";
import "react-toastify/ReactToastify.css";

const RootComponent = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage for authentication status
    const authStatus = localStorage.getItem("token");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleClick = () => {
    setIsClicked((prevState) => !prevState);
  };
  
  return (
    <div className="bg-[#f7f7f7]">
      {!isClicked && (
        <Home onClick={handleClick} isAuthenticated={isAuthenticated} />
      )}

      {isClicked && (
        <div>
          <ThirdwebProvider
            activeChain={Sepolia}
            clientId="790ab1ae3006cc0e8912a7003f169795"
          >
            <Router>
              <StateContextProvider>
                <App
                  onClick={handleClick}
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              </StateContextProvider>
            </Router>
          </ThirdwebProvider>
        </div>
      )}
      {!isClicked && <Footer />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RootComponent />);
