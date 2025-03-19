const mongoose = require("mongoose");
const UserModel = require("../Models/user");
const Campaign = require("../Models/campaign");

const addBookmark = async (req, res) => {
  try {
    const { userId, campaignId } = req.body;

    if (!userId || !campaignId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (isNaN(userId) || isNaN(campaignId)) {
      return res.status(400).json({ message: "Invalid userId or campaignId" });
    }

    const campaign = await Campaign.findOne({ id: campaignId });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.bookmarks.includes(campaignId)) {
      return res.status(400).json({ message: "Campaign already bookmarked" });
    }

    user.bookmarks.push(campaignId);
    await user.save();

    res.status(200).json({ message: "Campaign bookmarked successfully" });
  } catch (error) {
    console.error("Error in addBookmark:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const removeBookmark = async (req, res) => {
  try {
    const { userId, campaignId } = req.body;

    if (!userId || !campaignId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (isNaN(userId) || isNaN(campaignId)) {
      return res.status(400).json({ message: "Invalid userId or campaignId" });
    }

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarks.includes(campaignId)) {
      return res.status(400).json({ message: "Bookmark not found" });
    }

    user.bookmarks = user.bookmarks.filter((bookmark) => bookmark !== campaignId);
    await user.save();

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error in removeBookmark:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get all bookmarks for a user
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is in req.user after authMiddleware

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await UserModel.findOne({ id: userId }).populate("bookmarks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarks = await Campaign.find({ id: { $in: user.bookmarks } });

    res.status(200).json({ bookmarks });
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { addBookmark, removeBookmark, getBookmarks };