# Backend Setup Instructions

## Current Status
The UserManagement component is currently configured to work with mock data when the backend API is not available. This allows you to test the frontend functionality while developing or setting up the backend.

## Backend Requirements
The frontend expects a backend API running on `http://localhost:9000` with the following endpoints:

### User Management Endpoints
- `GET /api/admin/users` - Fetch all users
- `POST /api/admin/users` - Create a new user
- `PUT /api/admin/users/:id` - Update an existing user
- `DELETE /api/admin/users/:id` - Delete a user
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user active/inactive status

### Expected Data Structure
```javascript
// User object structure
{
  _id: "string", // MongoDB ObjectId
  name: "string",
  email: "string",
  role: "admin" | "moderator" | "customer",
  status: "active" | "inactive" | "suspended",
  phone: "string",
  address: "string",
  joinDate: "YYYY-MM-DD",
  lastLogin: "YYYY-MM-DD" | null
}

// API Response formats
GET /api/admin/users: { users: [User] } or [User]
POST /api/admin/users: { user: User }
PUT /api/admin/users/:id: User
DELETE /api/admin/users/:id: { message: "User deleted successfully" }
PATCH /api/admin/users/:id/toggle-status: User
```

## Authentication
The frontend sends JWT tokens in the Authorization header:
```
Authorization: Bearer <token>
```

## To Connect Real Backend

1. **Remove Mock Data**: Once your backend is ready, you can remove the mock data fallbacks from `src/redux/slices/adminSlice.js`

2. **Update Error Handling**: Change the thunks back to use `rejectWithValue()` instead of returning mock data

3. **Environment Variables**: Set `VITE_BACKEND_URL` in your `.env` file if your backend is not on localhost:9000

## Current Mock Data
The component currently shows 6 sample users with different roles and statuses for testing purposes.

## Testing
You can test all CRUD operations in the User Management interface:
- Add new users
- Edit existing users
- Delete users
- Toggle user status (active/inactive)
- Search and filter users

All operations will work with local state until connected to a real backend.
