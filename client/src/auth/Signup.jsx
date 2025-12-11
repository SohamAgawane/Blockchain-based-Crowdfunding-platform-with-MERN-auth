import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../util";

import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { SiEthereum } from "react-icons/si";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Wallet state
  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connectingWallet, setConnectingWallet] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedChain = localStorage.getItem("chainId");

    if (savedAddress) setWalletAddress(savedAddress);
    if (savedChain) setChainId(savedChain);

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (!accounts.length) {
          setWalletAddress(null);
          localStorage.removeItem("walletAddress");
        } else {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", (chain) => {
        setChainId(chain);
        localStorage.setItem("chainId", chain);
      });
    }
  }, []);

  const shortAddress = (addr) => {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  const chainName = (chain) => {
    const map = {
      "0x1": "Ethereum Mainnet",
      "0x5": "Goerli",
      "0x89": "Polygon Mainnet",
      "0x13881": "Polygon Mumbai",
    };
    return map[chain] || "Unknown Network";
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      return handleError("MetaMask not found. Please install a wallet.");
    }

    try {
      setConnectingWallet(true);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chain = await window.ethereum.request({
        method: "eth_chainId",
      });

      setWalletAddress(accounts[0]);
      setChainId(chain);

      localStorage.setItem("walletAddress", accounts[0]);
      localStorage.setItem("chainId", chain);

      handleSuccess("Wallet connected!");
    } catch (err) {
      handleError(err.message || "Could not connect wallet.");
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;

    if (!name || !email || !password) {
      return handleError("Name, Email, and Password are required.");
    }

    try {
      setLoading(true);

      const body = { ...form };
      if (walletAddress) body.walletAddress = walletAddress;

      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message || "Signup successful!");
        setTimeout(() => navigate("/login"), 900);
      } else {
        handleError(error?.details?.[0]?.message || message || "Signup failed");
      }
    } catch (err) {
      handleError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 py-12">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-10 rounded-3xl bg-white shadow-xl">

          {/* Gradient Heading */}
          <h2 className="text-[32px] font-bold leading-tight bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Web3 crowdfunding,<br /> built for creators.
          </h2>

          <p className="mt-4 text-slate-600 text-[15px]">
            Launch bold ideas with trustless funding.<br />
            Backers stay protected. Creators get paid fairly.
          </p>

          {/* Gradient Orb + Ethereum Logo */}
          <div className="mt-12 flex justify-center relative">

            {/* Soft glowing orb */}
            {/* <div className="w-48 h-48 bg-gradient-to-br from-sky-300 to-purple-300 rounded-full blur-2xl opacity-40"></div> */}

            {/* Ethereum Logo Floating in Center */}
            <svg
              className="absolute w-16 h-16 opacity-80 drop-shadow-lg -top-9"
              viewBox="0 0 256 417"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#7c3aed" d="M127.6 0L0 214.8l127.6 73.5 127.6-73.5z" />
              <path fill="#a78bfa" d="M127.6 417l127.6-175.5-127.6 73.5-127.6-73.5z" />
            </svg>
          </div>
        </div>


        {/* RIGHT SIDE (SIGNUP FORM) */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Start launching or backing campaigns today
          </p>

          {/* Wallet connect section */}
          <div className="p-3 mb-4 flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center shadow-sm">
                <img
                  src="https://cdn.jsdelivr.net/gh/MetaMask/brand-resources/SVG/metamask-fox.svg"
                  alt="MetaMask"
                  className="w-6 h-6"
                />
              </div> */}

              <div>
                <div className="font-semibold text-sm text-slate-800">
                  Connect Wallet
                </div>
                <div className="text-xs text-slate-500">
                  Receive payouts on-chain
                </div>
              </div>
            </div>

            {!walletAddress ? (
              <button
                onClick={connectWallet}
                disabled={connectingWallet}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm"
              >
                {connectingWallet ? "Connecting..." : "Connect"}
              </button>
            ) : (
              <div className="text-right text-xs">
                <div className="font-medium">{shortAddress(walletAddress)}</div>
                <div className="text-slate-500">{chainName(chainId)}</div>
              </div>
            )}
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* NAME */}
            <label className="block">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiUser className="text-slate-400" />
                <span>Name</span>
              </div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </label>

            {/* EMAIL */}
            <label className="block">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiMail className="text-slate-400" />
                <span>Email</span>
              </div>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </label>

            {/* PASSWORD */}
            <label className="block">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiLock className="text-slate-400" />
                <span>Password</span>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </label>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-xl text-white transition ${loading
                ? "bg-emerald-300 cursor-wait"
                : "bg-gradient-to-r from-emerald-500 to-sky-500 shadow-lg"
                }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
