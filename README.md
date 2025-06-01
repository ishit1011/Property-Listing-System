# Property Listing System - Backend

This is the backend API for the Property Listing System, built with **TypeScript**, **Express.js**, **MongoDB**, and **Redis**. It provides endpoints for user authentication, property listings, favorites, and more.

## Features

- User Authentication with JWT
- Property CRUD operations
- Favorite properties management
- Redis caching for performance optimization
- Environment variable management
- Secure token-based protected routes
- TypeScript with strict typing

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Redis
- JWT for authentication
- Render (for deployment)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Redis instance (local or cloud)
- npm or yarn

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/property-backend.git
   cd property-backend


---

### Running Locally

1. Build the project:

   ```bash
   npm run build

2. Start the server:

   ```bash
   npm start


---


## API Endpoints

### Auth Routes (`/auth`)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Property Routes (`/property`)

- `GET /property/read-prop` - List all properties with optional filters [one filter at a time : ?amenities=Lift]
- `POST /property/add-prop` - Add a new property (protected)
- `PUT /property/update-prop/:id` - Update property (protected)
- `DELETE /property/delete-prop/:id` - Delete property (protected)

### Favourite Routes (`/favourites`)

- `POST /favourites/post-fav/:id` - Add a property to user's favourites (protected)
- `GET /favourites/read-fav` - Get user’s favourite properties (protected)
- `DELETE /favourites/delete-fav` - Delete user’s favourite properties (protected)

## Middleware

- **protectMiddleware**: Validates JWT token in Authorization header, attaches user info to `req.user`


## Redis Integration

- Redis is used for caching to improve performance.
- Connection URL is provided via `REDIS_URL` environment variable.
- Redis client connects on app startup.


## Deployment on Render

1. Push your code to GitHub (or any git provider).
2. Create a new Web Service on Render:
   - Connect your repo
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. Create a Redis instance on Render and copy the Redis URL.
4. Add `REDIS_URL` environment variable in your Web Service settings.
5. Add other environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in Render environment.
6. Deploy and test your API.

## License

This project is licensed under the MIT License.

## Contact

For questions or contributions, reach out at [singhishit.06@gmail.com]

