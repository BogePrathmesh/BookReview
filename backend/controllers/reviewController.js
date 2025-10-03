import Review from '../models/Review.js';
import Book from '../models/Book.js';

export const createReview = async (req, res, next) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    if (!bookId || !rating || !reviewText) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingReview = await Review.findOne({
      bookId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      reviewText
    });

    await review.populate('userId', 'name email');

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, reviewText } = req.body;

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;

    await review.save();
    await review.populate('userId', 'name email');

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('bookId', 'title author')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};
