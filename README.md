# Evergreen Items Backend API

## 📄 Project Overview

A Node.js backend API for real-time collaborative item management with WebSocket support. Built with Express.js, Socket.IO, and MongoDB for seamless real-time synchronization across multiple clients.

**Version:** 1.0.0  
**Node.js Version:** 18.17.0  
**npm Version:** 9.6.7

## 🛠️ Setup Instructions

1. **Clone the repository:**
```
git clone https://github.com/TitusKI/Tasker-with-websocket

```
2. **Navigate to the project directory:**
```
cd Tasker-with-websocket

```
3. **Install dependencies:**
```
npm install

```
4. **Set up environment variables:**
```
cp .env.example .env

```
5. **Start the server:**
```
npm start

```
## ✨ Features

**Core Features:**
- RESTful API for CRUD operations
- Real-time WebSocket communication
- MongoDB data persistence
- Active users tracking
- Cross-origin resource sharing (CORS)

**API Endpoints:**
- `GET /api/items` - Fetch all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

**Real-time Events:**
- `ITEM_CREATED` - New item added
- `ITEM_UPDATED` - Item modified
- `ITEM_DELETED` - Item removed
- `ACTIVE_USERS_COUNT` - User count updates

**Technical:**
- Express.js web framework
- Socket.IO for WebSocket connections
- MongoDB with Mongoose ODM
- Input validation and sanitization
- Error handling middleware

## 📂 Folder Structure

```
src/
 ├── controllers/          # Request handlers
 ├── models/              # Database schemas
 ├── routes/              # API route definitions
 ├── utils/               # Helper functions
 └── config/              # Configuration files

```
## 🔧 Key Dependencies
```
{
   "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "mongoose": "^8.15.1",
    "ws": "^8.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

```
## 🗄️ Database Schema

```
// Item Schema
{
  _id: ObjectId,
  title: String (required),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date

}

```

## 📱 Compatibility

- **Node.js:** 16.0+
- **MongoDB:** 4.4+
- **Browser Support:** All modern browsers with WebSocket support

---

**Built with using Node.js v22.14.0**