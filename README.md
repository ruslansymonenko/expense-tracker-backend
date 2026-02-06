# Expense Tracker Backend API

Simple Express.js + TypeScript backend for the Expense Tracker mobile app, using Google Cloud MySQL.

## Features

- JWT authentication (register/login)
- CRUD operations for categories
- CRUD operations for expenses
- MySQL database with proper relationships
- Input validation
- CORS enabled

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MySQL (Google Cloud SQL)
- JWT for authentication
- bcryptjs for password hashing

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your Google Cloud MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000

# Google Cloud MySQL
DB_HOST=your-google-cloud-mysql-ip
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=expense_tracker

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### 3. Seed the database

This will create tables and populate them with initial data:

```bash
npm run seed
```

### 4. Start the server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
  - Body: `{ "email": "user@test.com", "password": "123456", "name": "User Name" }`
  - Returns: `{ "user": {...}, "token": "..." }`

- `POST /auth/login` - Login
  - Body: `{ "email": "user@test.com", "password": "123456" }`
  - Returns: `{ "user": {...}, "token": "..." }`

### Categories

- `GET /categories` - Get all categories (public)
- `GET /categories/:id` - Get single category
- `POST /categories` - Create category (protected)
- `PUT /categories/:id` - Update category (protected)
- `DELETE /categories/:id` - Delete category (protected)

### Expenses

All expense routes require authentication (`Authorization: Bearer <token>`).

- `GET /expenses` - Get all user's expenses
- `GET /expenses/:id` - Get single expense
- `POST /expenses` - Create expense
  - Body: `{ "title": "...", "amount": 100, "categoryId": "...", "date": "2026-02-05T00:00:00.000Z" }`
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

## Test Accounts

After seeding, you can use these test accounts:

- Email: `test@test.com`, Password: `123456`
- Email: `demo@example.com`, Password: `demo123`

## Database Schema

### users

- `id` (VARCHAR 36, PRIMARY KEY)
- `email` (VARCHAR 255, UNIQUE)
- `name` (VARCHAR 255)
- `password` (VARCHAR 255, hashed)
- `created_at` (TIMESTAMP)

### categories

- `id` (VARCHAR 36, PRIMARY KEY)
- `name` (VARCHAR 100)
- `icon` (VARCHAR 50)
- `color` (VARCHAR 7)
- `created_at` (TIMESTAMP)

### expenses

- `id` (VARCHAR 36, PRIMARY KEY)
- `title` (VARCHAR 255)
- `amount` (DECIMAL 10,2)
- `category_id` (VARCHAR 36, FOREIGN KEY)
- `date` (DATETIME)
- `user_id` (VARCHAR 36, FOREIGN KEY)
- `created_at` (TIMESTAMP)

## Notes

- All dates are in ISO-8601 format
- Passwords are hashed using bcrypt
- JWT tokens expire in 7 days (configurable)
- CORS is enabled for all origins (configure for production)
- Users can only access their own expenses

## Development

The server uses `ts-node-dev` for hot-reload during development. Any changes to `.ts` files will automatically restart the server.

## Production Deployment

1. Build the TypeScript code: `npm run build`
2. Set up environment variables on your server
3. Run with: `npm start`
4. Make sure your Google Cloud MySQL instance allows connections from your server IP

## License

MIT
