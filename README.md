# 📚 Bookstore REST API

A fully functional RESTful API for managing a bookstore's book collection. Built with **Node.js**, **Express.js**, and **MongoDB** as part of the Backend Development Internship Task (Phase 2).

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework / routing |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM (Object Document Mapper) |
| express-validator | Input validation |
| dotenv | Environment variable management |
| nodemon | Auto-restart during development |
| Postman | API testing |

---

## 📁 Project Structure

```
bookstore-api/
├── app.js              # Entry point — sets up Express, DB connection, middleware
├── routes/
│   └── bookRoutes.js   # Route definitions + validation rules
├── models/
│   └── Book.js         # Mongoose schema and model
├── controllers/
│   └── bookController.js  # CRUD logic for each route
├── .env                # Environment variables (not committed to Git)
├── .env.example        # Example env file (safe to commit)
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- [Postman](https://www.postman.com/) (for testing)

### Step 1 — Clone the repository
```bash
git clone https://github.com/<your-username>/bookstore-api.git
cd bookstore-api
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Set up environment variables
```bash
cp .env.example .env
```
Then open `.env` and replace the placeholder with your MongoDB Atlas connection string:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookstoreDB?retryWrites=true&w=majority
```

### Step 4 — Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

The API will be available at **http://localhost:5000**

---

## 📡 API Endpoints

Base URL: `http://localhost:5000`

### Book Schema

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "price": 15,
  "isbn": "9780061122415",
  "publishedDate": "1988-01-01"
}
```

---

### 1. Create a Book
**POST** `/books`

**Request Body:**
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "price": 20,
  "isbn": "1234567890",
  "publishedDate": "2018-10-16"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "665abc123def456ghi789",
    "title": "Atomic Habits",
    "author": "James Clear",
    "price": 20,
    "isbn": "1234567890",
    "publishedDate": "2018-10-16T00:00:00.000Z",
    "createdAt": "2026-06-07T10:00:00.000Z",
    "updatedAt": "2026-06-07T10:00:00.000Z"
  }
}
```

---

### 2. Get All Books
**GET** `/books`

**Optional Query Params:**
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |
| `search` | string | Filter by title (case-insensitive) |
| `author` | string | Filter by author (case-insensitive) |

**Examples:**
```
GET /books
GET /books?page=2&limit=5
GET /books?search=Atomic
GET /books?author=James&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 3,
  "count": 10,
  "data": [ ...array of books... ]
}
```

---

### 3. Get a Single Book
**GET** `/books/:id`

**Example:** `GET /books/665abc123def456ghi789`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "665abc123def456ghi789",
    "title": "Atomic Habits",
    "author": "James Clear",
    "price": 20,
    "isbn": "1234567890",
    "publishedDate": "2018-10-16T00:00:00.000Z"
  }
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "message": "Book not found"
}
```

---

### 4. Update a Book
**PUT** `/books/:id`

**Example:** `PUT /books/665abc123def456ghi789`

**Request Body (all fields optional):**
```json
{
  "price": 25,
  "title": "Atomic Habits (Updated Edition)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { ...updated book object... }
}
```

---

### 5. Delete a Book
**DELETE** `/books/:id`

**Example:** `DELETE /books/665abc123def456ghi789`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": { ...deleted book object... }
}
```

---

## ✅ Bonus Features Implemented

- **Input Validation** using `express-validator` — all fields are validated with meaningful error messages
- **Pagination** — `?page=` and `?limit=` query params on `GET /books`
- **Search Filter** — `?search=` (by title) and `?author=` query params on `GET /books`
- **Duplicate ISBN detection** — returns `409 Conflict` instead of crashing
- **Timestamps** — `createdAt` and `updatedAt` auto-managed by Mongoose
- **Global 404 handler** — clean response for undefined routes
- **Global error handler** — consistent error format across all routes

---

## 🧪 Testing with Postman

1. Open Postman and create a new Collection called **Bookstore API**
2. Add requests for each of the 5 endpoints listed above
3. For POST and PUT requests, set:
   - Header: `Content-Type: application/json`
   - Body: `raw` → `JSON`
4. Use the sample inputs from this README

---

## 👤 Author

**Ibtihaj Ahmed**  
BS Artificial Intelligence Student  
GitHub: [@ibtihajahmed](https://github.com/ibtihajahmed)
