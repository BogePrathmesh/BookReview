import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, CreditCard as Edit, Trash2, ArrowLeft } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
  averageRating: string;
  reviewCount: number;
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Review {
  _id: string;
  rating: number;
  reviewText: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await bookAPI.getBookById(id!);
      setBook(response.data.book);
      setReviews(response.data.reviews);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await reviewAPI.createReview(
        { bookId: id, ...reviewForm },
        token
      );
      setReviewForm({ rating: 5, reviewText: '' });
      setShowReviewForm(false);
      fetchBookDetails();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteBook = async () => {
    if (!token || !window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookAPI.deleteBook(id!, token);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewAPI.deleteReview(reviewId, token);
      fetchBookDetails();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const userHasReviewed = reviews.some((review) => review.userId._id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Books</span>
        </Link>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
              <p className="text-gray-500">{book.genre} • {book.year}</p>
            </div>

            {user && user.id === book.addedBy._id && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit-book/${book._id}`}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDeleteBook}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Star className="text-yellow-500 fill-current" size={24} />
            <span className="text-2xl font-bold text-gray-900">
              {book.averageRating > 0 ? book.averageRating : 'N/A'}
            </span>
            <span className="text-gray-500">
              ({book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">{book.description}</p>

          <p className="text-sm text-gray-500">Added by {book.addedBy.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {user && !userHasReviewed && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  required
                  minLength={10}
                  value={reviewForm.reviewText}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, reviewText: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={4}
                  placeholder="Share your thoughts about this book..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userId.name}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} />
                        ))}
                      </div>
                    </div>

                    {user && user.id === review.userId._id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 mt-2">{review.reviewText}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
