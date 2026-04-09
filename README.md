# Cybersecurity Training & Certification System

An Enterprise-Grade Interactive Touch-Panel Training System focused on cybersecurity awareness.

## Features
-   **Interactive Modules**: Touch-optimized interface for 24-55" screens.
-   **Gamified Learning**: Progress bars, confetti, and badges.
-   **Smart Certification**: Auto-generated PDF certificates with valid QR codes.
-   **Admin Dashboard**: Manage modules and view analytics.
-   **Secure**: JWT Authentication and Role-based Access Control.

## Tech Stack
-   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React.
-   **Backend**: Node.js, Express, MongoDB, Mongoose.

## Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/cyber_training
# JWT_SECRET=your_secret

# Seed Database (Optional)
node seed.js

# Start Server
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access
-   **User Portal**: http://localhost:3000
-   **Admin Portal**: http://localhost:3000/admin/login
    -   *Credentials*: admin@cyber.com / admin123
