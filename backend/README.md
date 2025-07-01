# Task Manager Backend API

A robust RESTful API for task management built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Task Management**: Full CRUD operations for tasks with advanced filtering and search
- **User Management**: Admin panel for user management and statistics
- **Task Comments**: Collaborative features with comments on tasks
- **Advanced Filtering**: Filter tasks by status, priority, assignee, due date, and more
- **Pagination**: Efficient data loading with pagination support
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Password hashing, CORS protection, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file
   - The database will be created automatically on first connection

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/tasks` | Get all tasks (with filtering) | Private |
| POST | `/api/tasks` | Create new task | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| PUT | `/api/tasks/:id/complete` | Mark task as completed | Private |
| POST | `/api/tasks/:id/comments` | Add comment to task | Private |
| GET | `/api/tasks/overdue` | Get overdue tasks | Private |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get single user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| GET | `/api/users/assignable` | Get users for task assignment | Private |
| GET | `/api/users/:id/stats` | Get user statistics | Admin |

## API Usage Examples

### Authentication

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Tasks

**Create a new task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the new feature",
    "priority": "high",
    "dueDate": "2024-01-15T23:59:59.000Z",
    "assignedTo": "USER_ID_HERE",
    "category": "Documentation"
  }'
```

**Get tasks with filtering:**
```bash
curl -X GET "http://localhost:5000/api/tasks?status=pending&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Data Models

### User Schema
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  avatar: String,
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Task Schema
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  dueDate: Date (required),
  completedAt: Date,
  assignedTo: ObjectId (ref: 'User', required),
  createdBy: ObjectId (ref: 'User', required),
  category: String,
  tags: [String],
  attachments: [Object],
  comments: [Object],
  estimatedHours: Number,
  actualHours: Number,
  isRecurring: Boolean,
  recurringPattern: String,
  timestamps: true
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configurable CORS settings
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Comprehensive validation on all inputs
- **Role-based Access**: Admin and user role permissions

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── taskController.js    # Task management logic
│   └── userController.js    # User management logic
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User data model
│   └── Task.js             # Task data model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── tasks.js            # Task routes
│   └── users.js            # User routes
├── utils/
│   └── generateToken.js    # JWT token generation
├── server.js               # Main application file
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 