const Review = require("../models/reviewModel");
const router = require("express").Router();
const Movie = require("../models/movieModel");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const logger = require("../logger/logging");
// add review

router.post("/", authMiddleware, async (req, res) => {
  try {
    req.body.user = req.userId;
    const newReview = new Review(req.body);
    await newReview.save();
    logger.info("[Success] Review added successfullly to the database by user" + req.userId)
    // calculate average rating and update in movie
    logger.info("Calculating the average rating and update in the movie")
    const movieId = new mongoose.Types.ObjectId(req.body.movie);
    const averageRating = await Review.aggregate([
      {
        $match: {
          movie: movieId,
        },
      },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRatingvalue = averageRating[0]?.averageRating || 0;

    await Movie.findOneAndUpdate(movieId, {
      rating: averageRatingvalue,
    });

    res
      .status(200)
      .json({ message: "Review added successfully", success: true });
      

  } catch (error) {
    logger.info("[Failure]" + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// get all reviews by movie id

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find(req.query || {})
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("movie");

    res.status(200).json({ data: reviews, success: true });
    logger.info("[Success] Fetched all reviews successfullly from the database")
  } catch (error) {
    logger.info("[Failure]" + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// update review

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // calculate average rating and update in movie
    const movieId = new mongoose.Types.ObjectId(req.body.movie);
    const averageRating = await Review.aggregate([
      {
        $match: {
          movie: movieId,
        },
      },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRatingvalue = averageRating[0]?.averageRating || 0;

    await Movie.findOneAndUpdate(movieId, {
      rating: averageRatingvalue,
    });

    res
      .status(200)
      .json({ message: "Review updated successfully", success: true });
      logger.info("[Success] Review updated successfullly from the database")
  } catch (error) {
    logger.info("[Failure]" + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// delete review

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    // calculate average rating and update in movie
   
    const movieId = new mongoose.Types.ObjectId(req.body.movie);
    const averageRating = await Review.aggregate([
      {
        $match: {
          movie: movieId,
        },
      },
      {
        $group: {
          _id: "$movie",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRatingvalue = averageRating[0]?.averageRating || 0;

    await Movie.findOneAndUpdate(movieId, {
      rating: averageRatingvalue,
    });

    res
      .status(200)
      .json({ message: "Review deleted successfully", success: true });
      logger.info("[Success] Review deleted successfullly from the database")
  } catch (error) {
    logger.info("[Failure]" + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
