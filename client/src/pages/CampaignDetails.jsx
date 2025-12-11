import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaTwitter, FaEnvelope, FaShareAlt } from "react-icons/fa";
import { LuBookmarkMinus, LuBookmarkPlus } from "react-icons/lu";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { useStateContext } from "../context";
import { CustomButton, Loader, CountBox } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import { motion } from "framer-motion";

/**
 * CampaignDetails.jsx
 * Very long, highly-detailed, visually-rich Campaign Details page (JSX).
 * - Finance / Web3 themed: gradients, glass panels, KPI badges, animations
 * - Full feature set: share, copy link, like, bookmark, donate modal, timeline, donor ledger
 * - Defensive checks and graceful fallbacks for missing state/context
 *
 * Drop-in replacement for your existing file.
 */

export default function CampaignDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    donate,
    getDonations,
    contract,
    address,
    getUserCampaigns,
    likeCampaign,
    getLikesAndDislikes,
  } = useStateContext();

  // redirect if opened directly without state
  useEffect(() => {
    if (!state) {
      navigate("/crowd-funding", { replace: true });
    }
  }, [state, navigate]);

  // local UI state
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [likes, setLikes] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [creatorCampaignCount, setCreatorCampaignCount] = useState(0);
  const [copyState, setCopyState] = useState({ copied: false, text: "" });
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [confirmingDonation, setConfirmingDonation] = useState(false);
  const [activity, setActivity] = useState([]); // timeline / activity entries
  const topRef = useRef(null);

  // normalized fields
  const pId = state?.pId ?? state?.id ?? state?.campaignId ?? "unknown-id";
  const target = state?.target ?? 0;
  const amountCollected = state?.amountCollected ?? 0;
  const remainingDays = daysLeft(state?.deadline);
  const percent = Math.min(100, Math.max(0, calculateBarPercentage(target, amountCollected)));
  const title = state?.title ?? "Campaign";

  // --- Data fetching / side effects -------------------------

  // likes
  useEffect(() => {
    let mounted = true;
    if (!pId || typeof getLikesAndDislikes !== "function") return;
    (async () => {
      try {
        const d = await getLikesAndDislikes(pId);
        if (mounted) setLikes(d?.likes ?? 0);
      } catch (e) {
        console.warn("getLikesAndDislikes failed", e);
      }
    })();
    return () => (mounted = false);
  }, [pId, getLikesAndDislikes]);

  // donators
  const fetchDonators = useCallback(async () => {
    if (!pId || typeof getDonations !== "function") {
      setDonators([]);
      return;
    }
    try {
      const d = await getDonations(pId);
      setDonators(Array.isArray(d) ? d : []);
    } catch (e) {
      console.warn("getDonations", e);
      setDonators([]);
    }
  }, [pId, getDonations]);

  // creator campaigns count
  const fetchCreatorCampaigns = useCallback(async () => {
    if (typeof getUserCampaigns !== "function") {
      setCreatorCampaignCount(0);
      return;
    }
    try {
      const list = await getUserCampaigns();
      setCreatorCampaignCount(Array.isArray(list) ? list.length : 0);
    } catch (e) {
      console.warn("getUserCampaigns", e);
      setCreatorCampaignCount(0);
    }
  }, [getUserCampaigns]);

  useEffect(() => {
    if (!contract) return;
    fetchDonators();
    fetchCreatorCampaigns();
  }, [contract, fetchDonators, fetchCreatorCampaigns]);

  // favorites (localStorage key: favorites_${address})
  useEffect(() => {
    if (!address) {
      setFavorites([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`favorites_${address}`);
      const parsed = raw ? JSON.parse(raw) : [];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  }, [address]);

  // small activity timeline built from donators + likes + createdAt if present
  useEffect(() => {
    const timeline = [];

    // campaign created (if deadline or createdAt exist)
    if (state?.createdAt) {
      timeline.push({
        type: "created",
        label: "Campaign created",
        time: new Date(state.createdAt).toLocaleString(),
        meta: null,
      });
    }

    // likes placeholder
    if (likes > 0) {
      timeline.push({
        type: "like",
        label: `${likes} likes`,
        time: new Date().toLocaleString(), // note: not exact
        meta: null,
      });
    }

    // donations (most recent first)
    (donators || []).slice(-6).reverse().forEach((d) => {
      timeline.push({
        type: "donation",
        label: `${d.donation} ETH pledged`,
        time: d.timestamp ? new Date(d.timestamp).toLocaleString() : "Recent",
        meta: { by: d.donator },
      });
    });

    setActivity(timeline);
  }, [donators, likes, state]);

  // --- actions ------------------------------------------------

  const addFavorite = (id) => {
    if (!address) return;
    const key = `favorites_${address}`;
    const next = Array.from(new Set([...(favorites || []), id]));
    setFavorites(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const removeFavorite = (id) => {
    if (!address) return;
    const key = `favorites_${address}`;
    const next = (favorites || []).filter((f) => String(f) !== String(id));
    setFavorites(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const isFavorite = (id) => (favorites || []).some((f) => String(f) === String(id));

  const handleLike = async () => {
    if (!pId || typeof likeCampaign !== "function") return;
    setError("");
    try {
      await likeCampaign(pId);
      const d = await getLikesAndDislikes(pId);
      setLikes(d?.likes ?? 0);
    } catch (e) {
      setError(e?.message || "You can only vote once.");
    }
  };

  // copy to clipboard (link or address)
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState({ copied: true, text });
      setTimeout(() => setCopyState({ copied: false, text: "" }), 2200);
    } catch {
      setCopyState({ copied: false, text: "" });
    }
  };

  // share wrapper
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `${title} — ${url}`;
    if (platform === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    if (platform === "email") {
      const subject = encodeURIComponent("Check out this campaign");
      const body = encodeURIComponent(`${text}\n\nThought you'd like this.`);
      window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    }
  };

  // donation flow: open modal -> confirm -> call donate()
  const openDonateModal = () => {
    setDonationModalOpen(true);
  };

  const closeDonateModal = () => {
    setDonationModalOpen(false);
    setConfirmingDonation(false);
    setError("");
  };

  const confirmDonate = async () => {
    if (!pId || !amount) {
      setError("Enter an amount (ETH).");
      return;
    }
    setConfirmingDonation(true);
    setError("");
    try {
      await donate(pId, amount);
      await fetchDonators();
      setAmount("");
      setConfirmingDonation(false);
      setDonationModalOpen(false);
    } catch (e) {
      console.error("donate failed", e);
      setError(e?.message || "Donation failed.");
      setConfirmingDonation(false);
    }
  };

  // public copyable campaign link + scroll to top helper
  const handleCopyLink = async () => {
    copyToClipboard(window.location.href);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ensure donators are fresh after donation or mount
  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, fetchDonators]);

  // guard render
  if (!state) return null;

  // small helpers for truncation and display
  const shortAddr = (a) => (String(a || "").length > 14 ? `${String(a).slice(0, 6)}...${String(a).slice(-4)}` : a);
  const safeNumber = (n) => (n == null ? "0" : String(n));

  // ---- long, decorative JSX (keeps alignment and styling tight) ----
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-10 px-4 text-slate-900">
      {isLoading && <Loader />}

      <div ref={topRef} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN: large column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* HERO CARD */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36 }}
            className="relative rounded-2xl overflow-hidden shadow-xl bg-white"
          >
            <div className="relative h-[440px]">
              <img
                src={state.image}
                alt={state.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />

              {/* soft gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* floating glass card bottom */}
              <div className="absolute left-6 right-6 bottom-6">
                <div className="backdrop-blur-md bg-white/60 border border-white/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-extrabold text-slate-900 truncate">{state.title}</h1>
                    <div className="mt-1 text-sm text-slate-700">
                      by <span className="font-medium">{shortAddr(state.owner)}</span> • <span className="font-medium">{creatorCampaignCount}</span> campaigns
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">{safeNumber(amountCollected)}</div>
                      <div className="text-xs text-slate-600">Raised</div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow-sm">
                      {percent}% funded
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* progress + quick CTA */}
            <div className="px-6 pb-6 pt-4 flex flex-col gap-4">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600">
                    <div className="font-semibold">{percent}%</div>
                    <div className="text-xs">Funded</div>
                  </div>

                  <div className="text-sm text-slate-600">
                    <div className="font-semibold">{safeNumber(amountCollected)}</div>
                    <div className="text-xs">Raised of {safeNumber(target)} ETH</div>
                  </div>

                  <div className="text-sm text-slate-600">
                    <div className="font-semibold">{remainingDays < 0 ? "0" : remainingDays}</div>
                    <div className="text-xs">Days left</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={openDonateModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white font-semibold shadow-md hover:opacity-95"
                  >
                    Fund
                  </button>

                  <button
                    onClick={handleCopyLink}
                    title="Copy campaign link"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 border border-white/30 shadow-sm hover:shadow-md"
                  >
                    {copyState.copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                    <span className="text-sm">{copyState.copied ? "Copied" : "Copy link"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleShare("twitter")} className="p-2 rounded-md hover:bg-slate-50">
                      <FaTwitter className="text-[#1DA1F2]" />
                    </button>
                    <button onClick={() => handleShare("whatsapp")} className="p-2 rounded-md hover:bg-slate-50">
                      <FaWhatsapp className="text-[#25D366]" />
                    </button>
                    <button onClick={() => handleShare("email")} className="p-2 rounded-md hover:bg-slate-50">
                      <FaEnvelope className="text-[#db635c]" />
                    </button>
                    <button onClick={() => handleShare("whatsapp")} className="p-2 rounded-md hover:bg-slate-50" title="More">
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* STATS / KPI row — premium card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-4 bg-gradient-to-r from-white to-white/80 border border-white/30 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-50">
                <HiOutlineSparkles className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-600">{remainingDays < 0 ? "0" : remainingDays}</div>
                <div className="text-xs text-slate-600">Days Left</div>
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-gradient-to-r from-white to-white/80 border border-white/30 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-sky-50">
                <div className="text-sky-600 font-bold">Ξ</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-sky-600">{safeNumber(amountCollected)}</div>
                <div className="text-xs text-slate-600">Raised of {safeNumber(target)} ETH</div>
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-gradient-to-r from-white to-white/80 border border-white/30 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-lg bg-violet-50">
                <div className="text-violet-600 font-bold">★</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-violet-600">{donators.length}</div>
                <div className="text-xs text-slate-600">Backers</div>
              </div>
            </div>
          </div>

          {/* ACTION ROW (likes/bookmark) + timeline */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-white/30">
              <button
                onClick={handleLike}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white hover:shadow-md transition"
                aria-label="like"
              >
                <span className="text-2xl">👍</span>
                <span className="font-semibold">{likes}</span>
              </button>

              {error && <div className="text-sm text-red-600 ml-3">{error}</div>}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-sm border border-white/30">
                <button onClick={() => handleShare("email")} className="p-2 rounded-md hover:bg-slate-50" title="Email">
                  <FaEnvelope size={18} className="text-[#db635c]" />
                </button>
                <button onClick={() => handleShare("whatsapp")} className="p-2 rounded-md hover:bg-slate-50" title="WhatsApp">
                  <FaWhatsapp size={18} className="text-[#25D366]" />
                </button>
                <button onClick={() => handleShare("twitter")} className="p-2 rounded-md hover:bg-slate-50" title="Twitter">
                  <FaTwitter size={18} className="text-[#1DA1F2]" />
                </button>
              </div>

              <div>
                {isFavorite(pId) ? (
                  <button
                    onClick={() => removeFavorite(pId)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-800"
                    title="Remove bookmark"
                  >
                    <LuBookmarkMinus />
                    <span className="text-sm">Bookmarked</span>
                  </button>
                ) : (
                  <button
                    onClick={() => addFavorite(pId)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white shadow"
                    title="Add bookmark"
                  >
                    <LuBookmarkPlus />
                    <span className="text-sm">Bookmark</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LARGE STORY CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Story</h3>
            <p className="text-slate-700 leading-7 whitespace-pre-wrap">{state.description}</p>
          </div>

          {/* DONATOR LEDGER + ACTIVITY TIMELINE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Donor ledger */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Donators</h4>
                <div className="text-sm text-slate-500">{donators.length} total</div>
              </div>

              <div className="space-y-3 max-h-72 overflow-auto pr-2">
                {donators.length > 0 ? (
                  donators.map((d, i) => (
                    <div key={`${d.donator}-${i}`} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-slate-800 font-semibold">
                          {String(d.donator).slice(2, 4).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{d.donator}</div>
                          <div className="text-xs text-slate-500">Time: {d.timestamp ? new Date(d.timestamp).toLocaleString() : "Recent"}</div>
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-slate-900">{d.donation} ETH</div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No donators yet — be the first to support.</p>
                )}
              </div>
            </div>

            {/* Activity timeline */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Activity</h4>
                <div className="text-sm text-slate-500">Recent</div>
              </div>

              <div className="space-y-3">
                {activity.length > 0 ? (
                  activity.map((a, idx) => (
                    <div key={`act-${idx}`} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{a.label}</div>
                        <div className="text-xs text-slate-500">{a.time}{a.meta?.by ? ` • by ${shortAddr(a.meta.by)}` : ""}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR: sticky fund + creator */}
        <aside className="space-y-6 sticky top-8">
          {/* Fund panel */}
          <div className="bg-gradient-to-b from-white/95 to-white/80 border border-white/30 rounded-2xl p-5 shadow-lg w-full max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">Fund this project</h4>
              <div className="text-xs text-slate-500">Secure on-chain</div>
            </div>

            {remainingDays < 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="font-semibold">Campaign Closed</div>
                <div className="text-xs text-slate-600 mt-1">Thanks for your interest — check other projects.</div>
              </div>
            ) : (
              <>
                <label className="text-xs text-slate-600">Amount (ETH)</label>
                <div className="mt-2 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 px-1">Ξ</div>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.1"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    aria-label="Donation amount in ETH"
                  />
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  <div>Goal: <span className="font-medium text-slate-800">{safeNumber(target)} ETH</span></div>
                  <div>Raised: <span className="font-medium text-slate-800">{safeNumber(amountCollected)} ETH</span></div>
                </div>

                {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={openDonateModal}
                    className="px-3 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white font-semibold shadow"
                  >
                    Contribute
                  </button>

                  <button
                    onClick={() => { setAmount(""); setError(""); }}
                    className="px-3 py-2 rounded-full bg-white border border-slate-200 text-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Creator card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/30 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center overflow-hidden">
                <img src={thirdweb} alt="creator" className="w-7 h-7 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-900 truncate">{shortAddr(state.owner)}</div>
                <div className="text-xs text-slate-500">{creatorCampaignCount} campaigns</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate(`/profile`)}
                className="w-full px-3 py-2 rounded-full border border-slate-200 text-slate-800"
              >
                View Creator
              </button>

              <button
                onClick={() => { copyToClipboard(state.owner); }}
                className="w-full px-3 py-2 rounded-full bg-white/80 border border-slate-200 text-slate-800 flex items-center justify-center gap-2"
                title="Copy wallet address"
              >
                <FiCopy /> <span className="text-sm">Copy Wallet</span>
              </button>
            </div>
          </div>

          {/* small CTA card */}
          <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-4 shadow-sm w-full max-w-sm">
            <div className="text-sm text-slate-700">Want to help creators faster?</div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => { navigate("/create-campaign"); }}
                className="flex-1 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white font-semibold"
              >
                Launch Campaign
              </button>
              <button
                onClick={() => { navigate("/crowd-funding"); }}
                className="px-3 py-2 rounded-full bg-white border border-slate-200"
              >
                Browse
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* DONATION CONFIRMATION MODAL */}
      {donationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-2">Confirm Contribution</h3>
            <p className="text-sm text-slate-600 mb-4">You're about to contribute <strong>{amount || "0"} ETH</strong> to <strong>{state.title}</strong>.</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 text-sm">
                <div>Will go directly to the campaign's on-chain wallet.</div>
                <div className="text-xs text-slate-500 mt-1">Network fees not included.</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{amount || "0"} ETH</div>
              </div>
            </div>

            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

            <div className="flex gap-3">
              <button
                onClick={closeDonateModal}
                className="flex-1 px-3 py-2 rounded-full bg-white border border-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={confirmDonate}
                disabled={confirmingDonation}
                className={`flex-1 px-3 py-2 rounded-full text-white ${confirmingDonation ? "bg-emerald-300 cursor-wait" : "bg-gradient-to-r from-emerald-500 to-sky-400"}`}
              >
                {confirmingDonation ? "Processing..." : "Confirm & Donate"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
