const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());                         // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// ─── Routes ───────────────────────────────────────────────────────────────────

const bookRoutes = require('./routes/bookRoutes');

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '📚 Bookstore API is running!',
    version: '1.0.0',
    endpoints: {
      books: '/books',
    },
  });
});

app.use('/books', bookRoutes);

// 404 handler — catches any undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ─── Database + Server ───────────────────────────────────────────────────────

const PORT     = process.env.PORT     || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
