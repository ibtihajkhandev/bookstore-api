const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// ─── Helper ──────────────────────────────────────────────────────────────────

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return null;
};

// ─── CREATE a new book ────────────────────────────────────────────────────────
// POST /books
const createBook = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { title, author, price, isbn, publishedDate } = req.body;

    const book = await Book.create({ title, author, price, isbn, publishedDate });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    // MongoDB duplicate key error (isbn already exists)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A book with this ISBN already exists',
      });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── GET all books (with optional search & pagination) ───────────────────────
// GET /books?page=1&limit=10&search=Atomic&author=James
const getAllBooks = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 10;
    const skip   = (page - 1) * limit;

    // Build dynamic filter
    const filter = {};
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── GET one book by ID ───────────────────────────────────────────────────────
// GET /books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    // Invalid MongoDB ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid book ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── UPDATE a book ────────────────────────────────────────────────────────────
// PUT /books/:id
const updateBook = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }  // new:true returns updated doc
    );

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A book with this ISBN already exists',
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid book ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── DELETE a book ────────────────────────────────────────────────────────────
// DELETE /books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: book,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid book ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook };
