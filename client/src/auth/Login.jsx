import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleSuccess, handleError } from "../util";
import { ToastContainer } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff, FiChevronRight } from "react-icons/fi";
import { FiCpu } from "react-icons/fi";
import { motion } from "framer-motion";

/*
  Blockchain-aware Login (JSX)
  - Email/password login (keeps your previous flow)
  - Wallet connect (MetaMask) button + network & address display
  - Fresh, light finance styling for a crowdfunding dApp
*/

export default function Login() {
  const navigate = useNavigate();

  // standard form
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // wallet state
  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connectingWallet, setConnectingWallet] = useState(false);

  useEffect(() => {
    // If a wallet was connected earlier, try to restore display
    const cached = localStorage.getItem("walletAddress");
    const cachedChain = localStorage.getItem("chainId");
    if (cached) setWalletAddress(cached);
    if (cachedChain) setChainId(cachedChain);

    // listen to wallet/account changes (optional)
    if (window.ethereum) {
      window.ethereum.on?.("accountsChanged", (accounts) => {
        if (!accounts || accounts.length === 0) {
          setWalletAddress(null);
          localStorage.removeItem("walletAddress");
        } else {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        }
      });
      window.ethereum.on?.("chainChanged", (c) => {
        setChainId(c);
        localStorage.setItem("chainId", c);
      });
    }

    // cleanup listener on unmount (best effort)
    return () => {
      try {
        window.ethereum?.removeListener?.("accountsChanged", () => {});
        window.ethereum?.removeListener?.("chainChanged", () => {});
      } catch (e) {}
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Email/password login (unchanged flow)
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = form;
    if (!email || !password) return handleError("Email and Password are required.");

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess("Signed in — welcome back!");
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        // after login redirect to dashboard/campaigns
        setTimeout(() => navigate("/crowd-funding"), 600);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details || message);
      } else {
        handleError(message || "Login failed");
      }
    } catch (err) {
      handleError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // Wallet connect: basic MetaMask flow (request accounts)
  const connectWallet = async () => {
    if (!window.ethereum) {
      return handleError("No Ethereum wallet found. Install MetaMask or another wallet.");
    }

    try {
      setConnectingWallet(true);
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      const chain = await window.ethereum.request({ method: "eth_chainId" });

      setWalletAddress(address);
      setChainId(chain);
      localStorage.setItem("walletAddress", address);
      localStorage.setItem("chainId", chain);

      // Optional: you might want to verify the user on your backend by signing a message.
      handleSuccess("Wallet connected — ready to create/finance campaigns on-chain.");
    } catch (err) {
      handleError(err.message || "Wallet connection cancelled or failed.");
    } finally {
      setConnectingWallet(false);
    }
  };

  // helper: shorten wallet display
  const shortAddress = (addr) => {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  // helper: map chainId to friendly name (extend as needed)
  const chainName = (c) => {
    if (!c) return "No network";
    const map = {
      "0x1": "Ethereum Mainnet",
      "0x5": "Goerli",
      "0x13881": "Polygon Mumbai",
      "0x89": "Polygon",
      "0x4": "Rinkeby",
      "0x3": "Ropsten",
      "0x61": "BSC Testnet",
      "0x38": "BSC",
    };
    return map[c] || `Chain ${c}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 py-12">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* Left - Hero specific to blockchain crowdfunding */}
        <div className="hidden md:flex flex-col justify-between p-8 rounded-3xl bg-white shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-300 to-sky-400 flex items-center justify-center shadow-md">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 16.5L8 10l4 5 7-9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Pro Fund</h3>
                <p className="text-sm text-slate-500">On-chain crowdfunding — trustless, transparent</p>
              </div>
            </div>

            <h2 className="mt-8 text-3xl font-bold text-slate-900 leading-snug">
              Fund ideas with on-chain transparency
            </h2>
            <p className="mt-3 text-slate-600">
              Create, back and manage campaigns secured by smart contracts — escrow, payouts and audit trails baked into every campaign.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>• Escrowed funds until milestones are met</li>
              <li>• Verifiable contributions on-chain</li>
              <li>• Low-fee settlement via smart contracts</li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">Backers</p>
              <p className="text-sm font-semibold text-slate-800">12.3k</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">On-chain Value</p>
              <p className="text-sm font-semibold text-slate-800">$4.6M</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500">Live Campaigns</p>
              <p className="text-sm font-semibold text-slate-800">238</p>
            </div>
          </div>

          <svg className="mt-6 opacity-60" width="260" height="100" viewBox="0 0 260 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 C50 20, 100 110, 160 40 C200 0, 240 90, 260 60" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
          </svg>
        </div>

        {/* Right - Login / Wallet card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sign in to Pro Fund</h1>
              <p className="text-sm text-slate-500">Use email or connect your wallet to interact with campaigns on-chain.</p>
            </div>

            {/* wallet quick summary */}
            <div className="text-right">
              {walletAddress ? (
                <div className="text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-md bg-slate-50 text-slate-700 text-[12px]">{chainName(chainId)}</div>
                    <div className="px-2 py-1 rounded-md bg-slate-50 text-slate-700 text-[12px]">{shortAddress(walletAddress)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Not connected</div>
              )}
            </div>
          </div>

          {/* --- Wallet connect / Email login split --- */}
          <div className="space-y-4">
            {/* Wallet connect CTA */}
            <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <FiCpu className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Connect Wallet</div>
                    <div className="text-xs text-slate-500">Use MetaMask to sign transactions and manage on-chain contributions</div>
                  </div>
                </div>

                <div>
                  {walletAddress ? (
                    <button
                      onClick={() => {
                        // navigate to wallet dashboard / or onboarding flow
                        handleSuccess("Using wallet to continue");
                        navigate("/crowd-funding");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-sm"
                    >
                      Continue
                      <FiChevronRight />
                    </button>
                  ) : (
                    <button
                      onClick={connectWallet}
                      disabled={connectingWallet}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white font-medium hover:shadow-sm"
                    >
                      {connectingWallet ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* OR separator */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex-1 h-px bg-slate-100" />
              <div>or sign in with email</div>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-slate-400" />
                    <span>Email</span>
                  </div>
                </div>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:outline-none placeholder:text-slate-400"
                  aria-label="Email"
                />
              </label>

              <label className="block relative">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiLock className="text-slate-400" />
                    <span>Password</span>
                  </div>
                  <Link to="/forgot" className="text-sm text-amber-600 hover:underline">Forgot?</Link>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your secure password"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:outline-none pr-12 placeholder:text-slate-400"
                  aria-label="Password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-11 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  Remember me
                </label>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Need help?</span>
                  <Link to="/support" className="text-amber-600 hover:underline">Contact</Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 text-lg font-semibold py-3 rounded-xl transition ${loading ? "bg-amber-200 cursor-wait" : "bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg"}`}
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="3" stroke="currentColor" strokeDasharray="80" strokeDashoffset="60" fill="none" />
                  </svg>
                ) : null}
                <span>Sign in</span>
                <FiChevronRight className="text-white" />
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            New to Pro Fund?{" "}
            <Link to="/signup" className="text-emerald-600 font-medium hover:underline">Create account</Link>
          </div>

          <div className="mt-6 text-center">
            <hr className="border-slate-100 mb-3" />
            <p className="text-xs text-slate-400">By signing in you agree to our Terms & Privacy. On-chain contributions are recorded to the selected network.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
