# FinTooz Setup Guide

This guide will help you set up the FinTooz application with MongoDB connection between the frontend and backend.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory with the following content:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/fintooz
     JWT_SECRET=fintooz_jwt_secret_key
     DEEPSEEK_API_KEY=your_deepseek_api_key
     DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
     ```
   - For MongoDB Atlas, replace the MONGO_URI with your connection string:
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/fintooz
     ```

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will run at http://localhost:5000

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```
   The application will open at http://localhost:3000

## API Service

The frontend and backend are connected through a centralized API service located at `frontend/src/services/api.js`. This service handles all API calls to the backend and includes:

- Authentication API (register, login, get user)
- Transactions API (get, add, update, delete transactions)
- AI API (query, get finance advice)

The API service automatically adds the authentication token to all requests, making it easy to maintain and extend the application.

## MongoDB Connection

The backend connects to MongoDB using Mongoose. The connection is established in `server.js` using the MONGO_URI from the environment variables.

## Testing the Connection

1. Start both the backend and frontend servers
2. Register a new user account
3. Log in with your credentials
4. Add a transaction
5. View the transaction on the dashboard

If all steps work correctly, the MongoDB connection is successfully established between the frontend and backend.