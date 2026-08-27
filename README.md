# TaskFlow - Smart Team Task Management Platform

![TaskFlow Header](https://via.placeholder.com/1200x400.png?text=TaskFlow+MERN+SaaS)

TaskFlow is a production-style, full-stack SaaS application built on the MERN stack (MongoDB, Express, React, Node.js). It serves as a comprehensive project management tool designed with strict Role-Based Access Control (RBAC), robust RESTful APIs, and a professional Material UI frontend.

## 🚀 Features

- **Authentication & Security**: JWT-based stateless authentication, bcrypt password hashing, and API route protection.
- **Role-Based Access Control (RBAC)**:
  - `Admin`: Full access, manage users, delete users, view application statistics.
  - `Manager`: Create tasks for team members, view team analytics.
  - `User`: Create, view, edit, and delete their own tasks.
- **Advanced Task Management**: Full CRUD operations with dynamic MongoDB filtering, search (Regex), sorting, and server-side pagination.
- **Analytics Dashboard**: Real-time aggregation of task statuses, priorities, and overdue metrics utilizing the MongoDB Aggregation Pipeline (`$facet`).
- **Responsive UI/UX**: Built with Material UI (MUI) featuring custom themes, mobile-friendly navigation, data tables, and dynamic loading/empty states.

## 💻 Tech Stack

- **Frontend**: React.js, Vite, React Router DOM, Material UI (MUI), Axios, Context API.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs.
- **Database**: MongoDB, Mongoose ODM.

## 📂 Architecture & Folder Structure

TaskFlow follows a decoupled Client-Server architecture.

```text
TaskFlow/
├── server/                 # Node.js REST API
│   ├── config/             # DB connections
│   ├── controllers/        # Business logic (auth, tasks, users)
│   ├── middleware/         # JWT verification, Error handling
│   ├── models/             # Mongoose Schemas (User, Task)
│   ├── routes/             # Express API Endpoints
│   └── server.js           # Entry point
│
└── client/                 # React SPA (Vite)
    └── src/
        ├── components/     # Reusable UI (StatCards, ProtectedRoutes)
        ├── context/        # Global Auth State
        ├── layouts/        # Dashboard layout (Sidebar, Navbar)
        ├── pages/          # Login, Register, Tasks, Dashboard
        └── services/       # Axios API configurations
```

## ⚙️ Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=30d
   ```
   *Seed the database with test users/tasks (Optional):*
   ```bash
   npm run seed
   ```
   *Start the server:*
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Visit `http://localhost:5173` in your browser.

## 🔐 Seeded Demo Credentials

If you ran `npm run seed`, you can log in with:
- **Admin**: `admin@taskflow.com` | Pass: `password123`
- **Manager**: `manager@taskflow.com` | Pass: `password123`
- **User**: `user1@taskflow.com` | Pass: `password123`

## 📡 API Endpoints Overview

| Route | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new user |
| `/api/auth/login` | POST | Public | Authenticate user & get JWT |
| `/api/tasks` | GET | Private | Get tasks (supports `?keyword`, `?page`, `?sort`) |
| `/api/tasks` | POST | Private | Create a task |
| `/api/tasks/:id` | PUT/DEL | Private | Update/Delete task |
| `/api/dashboard/stats` | GET | Private | Get aggregated task metrics |
| `/api/users` | GET | Admin | Get all users |

## 🌟 Future Improvements
- Implement Email Notifications for overdue tasks (using Nodemailer).
- Add real-time updates using Socket.io.
- Containerize the application using Docker for easier deployment.
