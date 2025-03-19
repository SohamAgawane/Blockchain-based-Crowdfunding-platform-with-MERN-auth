const mongoose = require("mongoose");

const CampaignSchema  = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  purpose: { type: String, required: true },
  story: { type: String, required: true },
  goal: { type: Number, required: true },
  endDate: { type: Date, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Campaign', CampaignSchema);