# MGIR Backend API

Backend API for My Guide In Rome application with authentication, user management, and booking functionality.

## Features

- 🔐 **JWT Authentication** - Secure login/signup system
- 👤 **User Management** - Complete user profiles with billing info
- 💝 **Wishlist System** - Save favorite services and tours
- 📅 **Booking Management** - Track user bookings and history
- 🛡️ **Role-based Access** - Admin and user roles
- 🔒 **Security Features** - Rate limiting, password hashing, input validation
- 📊 **MongoDB Integration** - Robust data storage with Mongoose

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   - Copy `.env` file and update the values:
   ```bash
   # Update these values in .env file
   MONGODB_URI=mongodb://localhost:27017/mgir-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Start MongoDB**
   - Make sure MongoDB is running locally or update MONGODB_URI for cloud database

4. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**
   - Visit: http://localhost:5000/api/health
   - Should return: `{"message": "MGIR Backend Server is running!"}`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/me` | Get current user profile | Private |
| PUT | `/update-profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/wishlist` | Get user wishlist | Private |
| POST | `/wishlist` | Add item to wishlist | Private |
| DELETE | `/wishlist/:item` | Remove from wishlist | Private |
| GET | `/bookings` | Get user bookings | Private |
| POST | `/bookings` | Create new booking | Private |
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get single user | Admin |
| PUT | `/:id` | Update user | Admin |
| DELETE | `/:id` | Delete user | Admin |

## Request/Response Examples

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "country": "Italy",
  "city": "Rome",
  "agreeTerms": true
}
```

### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123",
  "remindMe": false
}
```

### Add to Wishlist
```bash
POST /api/users/wishlist
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "item": "Colosseum Private Tour"
}
```

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  country: String,
  province: String,
  address: String,
  zip: String,
  city: String,
  role: String (user/admin),
  isActive: Boolean,
  isEmailVerified: Boolean,
  wishlist: [String],
  bookings: [{
    serviceType: String,
    serviceName: String,
    bookingDate: Date,
    status: String
  }],
  agreeTerms: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcryptjs
- **Rate Limiting** on authentication endpoints
- **Input Validation** with Mongoose validators
- **CORS Protection** with configurable origins
- **Role-based Access Control**
- **Secure Cookies** for token storage

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Project Structure
```
backend/
├── models/           # Database models
│   └── User.js
├── routes/           # API routes
│   ├── auth.js
│   └── users.js
├── middleware/       # Custom middleware
│   └── auth.js
├── .env             # Environment variables
├── .gitignore       # Git ignore file
├── package.json     # Dependencies
├── server.js        # Main server file
└── README.md        # This file
```

## Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use secure `JWT_SECRET`
   - Configure production MongoDB URI
   - Set up proper CORS origins

2. **Security Checklist**
   - Enable HTTPS
   - Set secure cookie options
   - Configure rate limiting
   - Set up monitoring and logging
   - Regular security updates

## Support

For issues and questions:
- Check the logs for detailed error messages
- Ensure MongoDB connection is working
- Verify environment variables are set correctly
- Check that all required dependencies are installed

## License

MIT License - see LICENSE file for details.
