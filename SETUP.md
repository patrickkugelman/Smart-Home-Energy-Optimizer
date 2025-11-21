# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend server running on port 8085

## Installation & Run Commands

### Step 1: Install Dependencies

```bash
cd ui
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The UI will be available at: **http://localhost:5173**

## Complete Project Setup (All Services)

### Terminal 1 - Backend Server
```bash
cd server
mvn spring-boot:run
```

### Terminal 2 - Vue Frontend
```bash
cd ui
npm install
npm run dev
```

### Terminal 3 - Python Client (Optional)
```bash
cd client
pip install -r requirements.txt
python client.py
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues
Make sure the backend server is running on `http://localhost:8085` before starting the frontend.

### TypeScript Errors
Run `npm install` again to ensure all TypeScript dependencies are installed.

