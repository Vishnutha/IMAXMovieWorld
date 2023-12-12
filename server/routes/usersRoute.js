const User = require("../models/userModel");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../logger/logging");
// Register
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      logger.info("[Success] User Already exists with the email " + req.body.email);
      throw new Error("User with this email already exists");

}
    // Hash password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // Create new user
    await User.create(req.body);

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });

      logger.info("[Success] User Registered successfully with the email " + req.body.email);
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User with this email does not exist");

    // Check if user is active
    if (!user.isActive) throw new Error("User is not active");

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Invalid password");
      jwt_secret = "4de49e71da8814001d14d302b24519bb59ceabd68cc4e3dfdffac21bbd6dbfa49da2b4549d4fe37f87347c0bcc4c6634ca388fac10a21362e9a29e1049b9034c"
    // Create token
    const token = jwt.sign({ userId: user._id }, jwt_secret, {
      expiresIn: "1d",
    });
    // console.log(token)
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
    logger.info("[Success] User Loggend in successfully with the email " + req.body.email);
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get current user (protected)
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
    logger.info("[Success] User Fetched successfully with the Id " + req.userId);
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

router.put("/update-user", authMiddleware, async (req, res) => {
  try {
    if (req.body.newPassword && req.body.oldPassword) {
      const oldPassword = req.body.oldPassword;
      const user = await User.findById(req.body._id);
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect) throw new Error("The old password is incorrect");

      const newPassword = await bcrypt.hash(req.body.newPassword, 10);
      req.body.password = newPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
    logger.info("[Success] User Updated successfully with the email " + req.body._id);
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
    logger.info("[Success] User Fetched successfully");
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
