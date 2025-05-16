# Portfolio Website Backend

A robust Node.js backend for the portfolio website with features including authentication, contact form, file management, and memories gallery.

## Features

- **Authentication System**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Secure password hashing
  - Token-based session management

- **Contact Form**
  - Rate-limited message submission
  - Message management for admins
  - Read/unread status tracking
  - Device information tracking

- **Memories Gallery**
  - Image and video upload support
  - Automatic thumbnail generation
  - File type validation
  - Size limits and optimization
  - Pagination and filtering

- **Security Features**
  - CORS protection
  - Rate limiting
  - Helmet security headers
  - Input validation
  - File upload restrictions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create required directories:
   ```bash
   mkdir -p uploads/memories/thumbnails
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=50000000
   ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
   ```

4. Start MongoDB:
   ```bash
   # Make sure MongoDB is running on your system
   ```

5. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Messages
- `POST /api/messages` - Submit a message
- `GET /api/messages` - Get all messages (admin)
- `GET /api/messages/unread` - Get unread count (admin)
- `PUT /api/messages/:id/read` - Mark as read (admin)
- `DELETE /api/messages/:id` - Delete message (admin)

### Memories
- `POST /api/memories` - Upload memories (admin)
- `GET /api/memories` - Get all memories
- `DELETE /api/memories/:id` - Delete memory (admin)
- `PUT /api/memories/:id` - Update memory details (admin)

## Security Considerations

1. Set strong JWT_SECRET in production
2. Use HTTPS in production
3. Configure ALLOWED_ORIGINS for your domain
4. Regular security updates
5. Monitor server logs
6. Backup database regularly

## Error Handling

The API uses consistent error responses:
```json
{
    "success": false,
    "error": "Error message here"
}
```

## File Upload Limits

- Maximum file size: 50MB
- Supported formats: Images (jpg, png, gif) and Videos (mp4, mov)
- Maximum files per upload: 10
- Automatic thumbnail generation for images

## Development

1. Use nodemon for development:
   ```bash
   npm run dev
   ```

2. Monitor logs:
   ```bash
   tail -f logs/error.log
   ```

## Production Deployment

1. Set production environment variables
2. Use PM2 or similar process manager
3. Set up Nginx reverse proxy
4. Enable SSL/TLS
5. Configure proper CORS settings
6. Set up monitoring and logging

## License

MIT License 