FinTooz – AI-Powered Personal Finance Management System

FinTooz is a full-stack web application that helps users manage personal finances with AI assistance and voice command support. Track expenses, view insights, and get AI-driven financial recommendations in one place.

Features

User Authentication: Register, Login, Logout

Transaction Management: Add, Edit, Delete expenses and categorize them

Dashboard: Visualize financial summaries and charts

Voice Recognition: Input transactions and navigate via voice commands

AI-Powered Assistant: Get financial advice using DeepSeek AI

Tech Stack
Frontend

React.js

Material-UI for responsive design

Chart.js for data visualization

Web Speech API for voice recognition

Backend

Node.js with Express.js

MongoDB with Mongoose for data modeling

JWT for authentication

bcrypt for password encryption

Getting Started
Prerequisites

Node.js (v14 or higher)

MongoDB (local installation or MongoDB Atlas account)

Installation

Clone the repository

git clone https://github.com/Reaper4734/FinTooz.git
cd FinTooz


Setup the backend

cd backend
npm install





Configure environment variables
Create a .env file in the backend directory with the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions


Setup the frontend

cd frontend
npm install

Running the Application

Start backend server

cd backend
npm run dev


Server runs at: http://localhost:5000

Start frontend development server

cd frontend
npm start


Application opens at: http://localhost:3000
