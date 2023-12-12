const router = require("express").Router();
const Movie = require("../models/movieModel");
const Artist = require("../models/artistsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../logger/logging");
router.get("/", authMiddleware, async (req, res) => {
  try {
    const search = req.query.search || "";
    const [movies, artists] = await Promise.all([
      Movie.find({
        name: {
          $regex: search,
          $options: "i",
        },
      }),
      Artist.find({
        name: {
          $regex: search,
          $options: "i",
        },
      }),
    ]);
    res.status(200).json({
      data: {
        movies: movies || [],
        artists: artists || [],
      },
      success: true,
    });
    logger.info("[Success] Search rendered");

  } catch (error) {
    logger.info("[Failure]" + error.message);
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
