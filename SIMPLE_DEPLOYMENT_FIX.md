# Simple Deployment Fix

## The Problem
Render is running `npm run dev` (development mode) instead of building and serving your application in production mode.

## The Solution
I've updated your configuration to ensure Render properly builds and serves your application.

## What I Changed

### 1. Updated Package.json
- Added a new script `start:full` that:
  1. Builds your frontend React app (`npm run build`)
  2. Installs backend dependencies (`cd backend && npm install`)
  3. Starts your backend server (`node server.js`)

### 2. Updated Render.yaml
- Changed the startCommand to use `npm run start:full`
- This ensures the proper build and serve process

## How It Should Work Now

1. **Build Phase**:
   - Render runs `npm install && npm run build && cd backend && npm install`
   - Your frontend is built to static files in the `dist` directory
   - Backend dependencies are installed

2. **Start Phase**:
   - Render runs `npm run start:full`
   - This builds the frontend again (just to be sure) and starts the backend
   - Your backend server starts on port 5000
   - The backend serves both:
     - API endpoints under `/api/*`
     - Frontend static files from `dist` directory for all other routes

## Environment Variables You Need
Make sure these are set in your Render dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Deployment Steps
1. Commit and push these changes to GitHub
2. Go to your Render dashboard
3. Trigger a new deployment
4. Check that it now runs the backend server instead of the development server

## Expected Result
Instead of seeing:
```
==> Running 'npm run dev'
> vite
```

You should see something like:
```
Server is running on port 5000
Connected to MongoDB
```

And your application should be accessible at https://localhost:5000 without showing a blank page.