# BlogApp

A backend blog application for creating, reading, and managing blog posts. Built with a modern tech stack featuring a Node.js/Express API and MongoDB for data persistence.

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework and REST API
- **MongoDB** - NoSQL database
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing and security
- **Mongoose** - MongoDB object modeling

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
BlogApp/
├── controllers/                # API route handlers
│   ├── blogs.js               # Blog endpoints
│   ├── users.js               # User management endpoints
│   └── login.js               # Authentication endpoints
├── models/                     # MongoDB data models
│   ├── blog.js                # Blog schema
│   └── user.js                # User schema
├── utils/                      # Utility functions
│   ├── config.js              # Configuration management
│   ├── logger.js              # Logging utility
│   ├── middleware.js          # Express middleware
│   ├── for_testing.js         # Test utilities
│   └── list_helper.js         # Helper functions
├── tests/                      # Test files
│   ├── blog_api.test.js       # Blog API tests
│   └── test_helper.js         # Test configuration
├── app.js                      # Express application setup
├── index.js                    # Entry point
├── Dockerfile                  # Container image definition
├── docker-compose.yml          # Multi-container setup
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Blog Management**: Create, read, update, and delete blog posts
- **User Profiles**: User accounts with blog ownership tracking
- **Password Security**: Bcrypt-hashed passwords for secure authentication
- **User Association**: Blog posts are linked to their creators
- **RESTful API**: Clean, standard REST endpoints for all operations

## Prerequisites

- Docker and Docker Compose (for containerized setup)
- OR
- Node.js 18+ (for local backend development)
- MongoDB (for local database)

## Getting Started

### Option 1: Run with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BlogApp
   ```

2. Start all services:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

4. Stop all services:
   ```bash
   docker-compose down
   ```

### Option 2: Run Locally

#### Backend Setup

1. Navigate to the project directory:
   ```bash
   cd BlogApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (.env file):
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blogdb
   SECRET=your-secret-key-at-least-16-bytes
   NODE_ENV=development
   ```

4. Run the backend:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:3000

## Available Scripts

### Backend
- `npm start` - Run the application in production mode
- `npm run dev` - Start in development mode with watch mode (uses `node --watch`)
- `npm test` - Run tests with environment set to `test`

## API Endpoints

The backend provides the following main endpoints:

- **Authentication**
  - `POST /api/login` - User login, returns JWT token

- **Users**
  - `GET /api/users` - Get all users with their blogs
  - `POST /api/users` - Register a new user

- **Blogs**
  - `GET /api/blogs` - Get all blog posts
  - `POST /api/blogs` - Create a new blog post (requires authentication)
  - `PUT /api/blogs/{id}` - Update a blog post
  - `DELETE /api/blogs/{id}` - Delete a blog post (requires authentication and ownership)

## Database

MongoDB is used for data persistence. The database includes collections for:
- **Users** - User accounts with hashed passwords and blog references
- **Blogs** - Blog posts with author references, titles, URLs, and like counts

## Configuration

Configuration is managed through environment variables and `.env` file:

- **Backend**: `utils/config.js` reads environment variables from `.env`

## Development

### Making Changes

1. **Backend Changes**: Modify files in `controllers/`, `models/`, or `utils/`
2. **Hot Reload**: Uses `node --watch` for automatic server restarts during development

### Building for Production

```bash
npm run build
# or with Docker:
docker build -t blogapp .
```

## Docker

The application includes Dockerfiles and docker-compose configuration:

- `Dockerfile` - Build definition for Node.js application
- `docker-compose.yml` - Multi-container setup with MongoDB and Node API

### Building the image

```bash
docker build -t blogapp .
```

### Running a container

```bash
docker run \
  -e MONGODB_URI="mongodb://mongo:27017/blogdb" \
  -e PORT=3000 \
  -e SECRET="your-secret-key-at-least-16-bytes" \
  -p 3000:3000 \
  blogapp
```

## Environment Variables

### Backend
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string (required, e.g., `mongodb://mongo:27017/blogdb`)
- `SECRET` - JWT signing secret (minimum 16 bytes, required)
- `NODE_ENV` - Environment mode (`development`, `test`, `production`)

## License

This project is available under the MIT License. See LICENSE file for details.
