# NexusEvents - MERN Stack Event Management Platform

NexusEvents is a modern, full-stack web application designed for creating, discovering, and managing events. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a premium UI, robust authentication, and seamless event management capabilities.

## 🚀 Features

- **User Authentication**: Secure Login and Registration using JWT and bcrypt.
- **Event Management**: Create, Edit, and Delete events (Creators only).
- **Ownership Security**: Edit and Delete options are strictly limited to the user who created the event.
- **Image Uploads**: Upload event banners directly (handled via Multer).
- **RSVP System**: Users can join events and track their schedule.
- **Smart Search & Filters**: Filter events by category or search by title/location.
- **Dashboard**: A personalized space to view created events and joined events.
- **Premium UI**: A fully responsive, dark-themed interface with glassmorphism effects and smooth animations.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM** (Navigation)
- **Axios** (API Requests)
- **CSS3** (Custom Premium Design System)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express.js** (Server)
- **MongoDB & Mongoose** (Database)
- **JSON Web Token (JWT)** (Auth)
- **Bcryptjs** (Password Hashing)
- **Multer** (File Uploads)

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd mern-events-app
   ```

2. **Install Dependencies**
   Run this command in the **root directory** to install dependencies for both User Interface and Server simultaneously (if scripts are set up) or manually:

   *Root (if package.json exists):*
   ```bash
   npm install concurrently --save-dev
   ```

   *Server:*
   ```bash
   cd server
   npm install
   ```

   *Client:*
   ```bash
   cd client
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the Application**
   From the **root directory** (`d:\MERN`), run:
   ```bash
   npm run dev
   ```
   *This command uses `concurrently` to start both the Backend (Port 5000) and Frontend (Vite) simultaneously.*

## 📂 Project Structure

```
MERN/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components (Navbar, EventCard)
│   │   ├── context/        # Auth Context
│   │   ├── pages/          # Application Pages (Home, Login, Dashboard)
│   │   └── index.css       # Global Styles
├── server/                 # Node.js Backend
│   ├── config/             # Database Connection
│   ├── controllers/        # Route Logic
│   ├── middleware/         # Auth & Upload Middleware
│   ├── models/             # Mongoose Models (User, Event)
│   ├── routes/             # API Routes
│   └── uploads/            # Image Storage Directory
└── package.json            # Root configuration (concurrently)
```

## 🛡️ License
This project is open-source and available under the MIT License.
