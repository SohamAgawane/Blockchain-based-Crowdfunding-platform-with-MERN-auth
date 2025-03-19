const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../Controllers/BookmarkController");

const router = require("express").Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findOne({ id: decoded.id });

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/add", authMiddleware, addBookmark);
router.post("/remove", authMiddleware, removeBookmark);
router.get("/all", authMiddleware, getBookmarks);

module.exports = router;
