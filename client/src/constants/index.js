import { createCampaign, dashboard, profile } from "../assets";

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Campaigns",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  {
    name: "Profile",
    imgUrl: profile,
    link: "/profile",
  },
];
