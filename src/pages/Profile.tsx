import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, BookOpen, Star, CreditCard as Edit, Trash2 } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
}

interface Review {
  _id: string;
  rating: number;
  reviewText: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
  };
  createdAt: string;
}

const Profile = () => {
  const { user, token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'books' | 'reviews'>('books');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!token) return;

    try {
      const [booksResponse, reviewsResponse] = await Promise.all([
        bookAPI.getUserBooks(token),
        reviewAPI.getUserReviews(token),
      ]);
      setBooks(booksResponse.data.books);
      setReviews(reviewsResponse.data.reviews);
    } catch (err: any) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookAPI.deleteBook(id, token);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewAPI.deleteReview(id, token);
      setReviews(reviews.filter((review) => review._id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 font-semibold text-lg">{books.length}</p>
              <p className="text-gray-700">Books Added</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-semibold text-lg">{reviews.length}</p>
              <p className="text-gray-700">Reviews Written</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('books')}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === 'books'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>My Books</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star size={20} />
                <span>My Reviews</span>
              </div>
            </button>
          </div>

          {activeTab === 'books' && (
            <div>
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't added any books yet.</p>
                  <Link
                    to="/add-book"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Your First Book
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {books.map((book) => (
                    <div
                      key={book._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <Link to={`/book/${book._id}`} className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600">
                            {book.title}
                          </h3>
                          <p className="text-gray-600">by {book.author}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {book.genre} • {book.year}
                          </p>
                        </Link>

                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-book/${book._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't written any reviews yet.</p>
                  <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Books
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          to={`/book/${review.bookId._id}`}
                          className="flex-1"
                        >
                          <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600">
                            {review.bookId.title}
                          </h3>
                          <p className="text-gray-600 text-sm">by {review.bookId.author}</p>
                        </Link>

                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} />
                        ))}
                      </div>

                      <p className="text-gray-700">{review.reviewText}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
