import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const createBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, year } = req.body;

    if (!title || !author || !description || !genre || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user._id
    });

    await book.populate('addedBy', 'name email');

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const total = await Book.countDocuments();
    const books = await Book.find()
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ bookId: book._id });
        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0;

        return {
          ...book.toObject(),
          averageRating: averageRating.toFixed(1),
          reviewCount: reviews.length
        };
      })
    );

    res.status(200).json({
      books: booksWithRatings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ bookId: book._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      book: {
        ...book.toObject(),
        averageRating: averageRating.toFixed(1),
        reviewCount: reviews.length
      },
      reviews
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, author, description, genre, year } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.year = year || book.year;

    await book.save();
    await book.populate('addedBy', 'name email');

    res.status(200).json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await Review.deleteMany({ bookId: book._id });
    await book.deleteOne();

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ addedBy: req.user._id })
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ books });
  } catch (error) {
    next(error);
  }
};
