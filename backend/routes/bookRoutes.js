import express from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getUserBooks
} from '../controllers/bookController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createBook);
router.get('/', getBooks);
router.get('/user', authenticate, getUserBooks);
router.get('/:id', getBookById);
router.put('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;
