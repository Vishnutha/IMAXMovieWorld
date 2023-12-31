const router = require("express").Router();
const multer = require("multer");
const cloudnaryConfig = require("../config/cloudinaryConfig");
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../logger/logging");
// Multer configuration
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

router.post(
  "/upload-image",
  authMiddleware,
  multer({ storage }).single("image"),
  async (req, res) => {
    try {
      const response = await cloudnaryConfig.uploader.upload(req.file.path, {
        folder: "imax-movie-world",
      });
      const imageUrl = response.secure_url;
      res.status(200).json({ message: "Image uploaded", data: imageUrl , success : true }
      
      
      );
      logger.info("[Success] Image uploaded to the cloud successfully")
    } catch (error) {
      logger.info("[Failure]" + error.message);
      res.status(500).json({ message: error.message, success: false });
    }
  }
);


module.exports = router;