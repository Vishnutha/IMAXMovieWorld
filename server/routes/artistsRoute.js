const Artist = require("../models/artistsModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../logger/logging");
// add new artist
router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.createdBy = req.userId;
    await Artist.create(req.body);
    logger.info("[Success] Artist added successfullly to the database")
    res.json({ message: "Artist added successfully", success: true });
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// get all artists
router.get("/", authMiddleware, async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    logger.info("[Success] Artists fetched successfullly from the database")
    res.json({ data: artists, success: true });
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// get artist by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    logger.info("[Success] Artist fetched successfullly from the database")
    res.json({ data: artist, success: true });
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// update artist
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, req.body , { new: true });
    logger.info("[Success] Artist Updated successfullly from the database")
    res.json({ message: "Artist updated successfully", success: true , data: updatedArtist });
  } catch (error) {
    logger.info("[Failure] " + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// delete artist
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Artist.findByIdAndDelete(req.params.id);
        logger.info("[Success] Artist deleted successfullly from the database")
        res.json({ message: "Artist deleted successfully", success: true });
    } catch (error) {
      logger.info("[Failure] " + error.message);
        res.status(500).json({ message: error.message, success: false });
    }
});

module.exports = router;
