# Car E-Commerce Platform

## Overview

This is a Car E-Commerce Platform, a web application designed to facilitate the purchase and management of cars. The platform includes user registration, authentication, role-based access control, product and order management, payment integration, and robust error handling.

---

## Features

### User Registration & Authentication

- **User Registration**: New users can create an account by providing necessary details.
- **Login Functionality**: Registered users can log in to access personalized features.
- **Role-Based Authentication**:
  - **User Role**: Standard access to view cars, place orders.
  - **Admin Role**: Enhanced access to manage cars, view all orders, and oversee platform activities.
- **JWT Token Management**: Secure user sessions using JSON Web Tokens (JWT).
- **Secure Password Hashing**: Passwords are hashed using bcrypt.
- **Logout Functionality**: Users can securely log out, invalidating their session.

### Database (MongoDB)

- **Users Collection**:
  - Fields: `name`, `email`, `password`, `role` (`user` or `admin`).
- **Products Collection**:
  - Fields: `name`, `brand`, `price`, `model`, `stock`, `description`, `imageUrl`.
- **Orders Collection**:
  - Fields: `userId`, `products` (array of product details), `totalPrice`, `status` (e.g., "Pending", "Completed"), `createdAt`.

### Product Management

- **CRUD Operations**:
  - **Create**: Add new cars to the inventory.
  - **Read**: Fetch car details for display.
  - **Update**: Modify car details.
  - **Delete**: Remove cars from the inventory.

### Order Management

- **CRUD Operations**:
  - **Create**: Place new orders (checks stock availability before confirming).
  - **Read**: Fetch order details for users and admins.
  - **Update**: Update order status (e.g., "Shipped", "Cancelled").
  - **Delete**: Remove orders.

### Payment Integration

- **Payment Gateway**: Integrated with SurjoPay for secure payment processing.
- **Payment Flow**:
  - Users can securely pay for their orders.
  - Payment status is updated in the order details.

### Error Handling

- **User-Friendly Error Messages**:
  - Invalid login attempts.
  - Out-of-stock cars.
  - Invalid API requests.
- **Consistent Error Responses**: Standardized error formats for API responses.

### Additional Features

- **Pagination**: Backend APIs support pagination for product listings and order retrieval.
- **Authentication Middleware**: Protects private routes to ensure only authenticated users can access them.

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Payment Gateway:** SurjoPay
- **State Management:** Redux Toolkit
- **Deployment:** Vercel

## Installation & Setup

### 💻 Backend Setup

```sh
# Install dependencies
npm install

# Set environment variables (.env)
NODE_ENV= development
PORT=5000
DB_URL="mongodb_url"
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET = jwt_access_secret
JWT_ACCESS_EXPIRES_IN=10d
# shurjopay
SP_ENDPOINT=sp_endpoint
SP_USERNAME=sp_username
SP_PASSWORD=sp_password
SP_PREFIX=SP
SP_RETURN_URL=https://the-car-shop.vercel.app/order/verify-payment


# Start the backend server
npm run dev
```

## Live Site Frontend : https://the-car-shop.vercel.app

## Live Site Backend : https://car-shop-backend.vercel.app
