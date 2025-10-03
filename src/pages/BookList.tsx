import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/api';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
    name: string;
  };
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page: number) => {
    setLoading(true);
    try {
      const response = await bookAPI.getBooks(page);
      setBooks(response.data.books);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Book Collection</h1>
          <p className="text-gray-600 mt-2">Discover and review amazing books</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {books.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No books found. Be the first to add one!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {books.map((book) => (
                <Link
                  key={book._id}
                  to={`/book/${book._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-sm text-gray-500 mb-3">{book.genre} • {book.year}</p>
                  <p className="text-gray-700 line-clamp-3 mb-4">{book.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500 fill-current" size={20} />
                      <span className="font-semibold text-gray-900">
                        {book.averageRating > 0 ? book.averageRating : 'N/A'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">Added by {book.addedBy.name}</p>
                </Link>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>

              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;
