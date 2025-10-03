# Book Review Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing books and reviews. Users can add books, write reviews, and rate books on a scale of 1-5 stars.

## Features

### Backend
- User authentication with JWT and bcrypt
- RESTful API structure with proper error handling
- Protected routes using middleware
- MongoDB database with Mongoose ODM
- Models:
  - **User**: name, email (unique), password (hashed)
  - **Book**: title, author, description, genre, year, addedBy (userId reference)
  - **Review**: bookId (reference), userId (reference), rating (1-5), reviewText

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `GET /api/auth/me` - Get current user (protected)

#### Books
- `GET /api/books` - Get all books with pagination (5 per page)
- `GET /api/books/:id` - Get book details with reviews and average rating
- `POST /api/books` - Create new book (protected)
- `PUT /api/books/:id` - Update book (protected, only creator)
- `DELETE /api/books/:id` - Delete book (protected, only creator)
- `GET /api/books/user` - Get current user's books (protected)

#### Reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected, only creator)
- `DELETE /api/reviews/:id` - Delete review (protected, only creator)
- `GET /api/reviews/user` - Get current user's reviews (protected)

### Frontend
- React with TypeScript
- React Router for navigation
- Context API for state management
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons

#### Pages
1. **Book List (Home)** - Browse all books with pagination
2. **Book Details** - View book info, reviews, and average rating
3. **Add/Edit Book** - Form to add or edit books (protected)
4. **Signup** - User registration
5. **Login** - User authentication
6. **Profile** - View user's books and reviews (protected)

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── bookController.js    # Book CRUD operations
│   │   └── reviewController.js  # Review CRUD operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Book.js              # Book schema
│   │   └── Review.js            # Review schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   ├── bookRoutes.js        # Book routes
│   │   └── reviewRoutes.js      # Review routes
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server setup
│
└── src/ (frontend)
    ├── components/
    │   ├── Navbar.tsx           # Navigation bar
    │   └── ProtectedRoute.tsx   # Route protection
    ├── context/
    │   └── AuthContext.tsx      # Authentication context
    ├── pages/
    │   ├── BookDetails.tsx      # Book details page
    │   ├── BookForm.tsx         # Add/Edit book page
    │   ├── BookList.tsx         # Home page with books
    │   ├── Login.tsx            # Login page
    │   ├── Profile.tsx          # User profile page
    │   └── Signup.tsx           # Registration page
    ├── services/
    │   └── api.ts               # API service with Axios
    ├── App.tsx                  # Main app component
    └── main.tsx                 # Entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `.env.example`):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookReviewDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

4. Update the `MONGODB_URI` with your MongoDB Atlas connection string:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster (if you haven't already)
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<username>`, `<password>`, and `<dbname>`

5. Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the project root directory (where package.json is located)

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in terminal)

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Log in with your credentials
3. **Browse Books**: View all books on the home page with pagination
4. **Add Book**: Click "Add Book" to create a new book entry
5. **View Details**: Click on any book to see details and reviews
6. **Write Review**: On a book's detail page, write a review and rate it
7. **Edit/Delete**: Manage your own books and reviews from the book details or profile page
8. **Profile**: View all your added books and written reviews

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## API Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes requiring authentication
- Ownership validation (users can only edit/delete their own content)
- Pagination for book listings (5 books per page)
- Average rating calculation for books
- One review per user per book constraint
- Automatic cascade delete of reviews when a book is deleted

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected API endpoints
- User ownership validation
- Password excluded from JSON responses
- CORS enabled for frontend communication

## License

ISC
