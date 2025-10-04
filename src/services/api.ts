import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post('/auth/signup', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getMe: (token: string) =>
    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const bookAPI = {
  getBooks: (page: number = 1) =>
    api.get(`/books?page=${page}`),

  getBookById: (id: string) =>
    api.get(`/books/${id}`),

  createBook: (bookData: any, token: string) =>
    api.post('/books', bookData, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateBook: (id: string, bookData: any, token: string) =>
    api.put(`/books/${id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteBook: (id: string, token: string) =>
    api.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getUserBooks: (token: string) =>
    api.get('/books/user', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const reviewAPI = {
  createReview: (reviewData: any, token: string) =>
    api.post('/reviews', reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateReview: (id: string, reviewData: any, token: string) =>
    api.put(`/reviews/${id}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteReview: (id: string, token: string) =>
    api.delete(`/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getUserReviews: (token: string) =>
    api.get('/reviews/user', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default api;
