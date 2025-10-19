# Render Deployment Guide

## Deployment Configuration

This application is configured to deploy on Render with a single service that handles both frontend and backend.

## How it Works

1. During the build phase:
   - The frontend is built using Vite (`npm run build`)
   - The built files are placed in the `dist` directory
   - Backend dependencies are installed

2. During the start phase:
   - The backend server starts on port 5000
   - The backend serves the frontend static files from the `dist` directory
   - API routes are available under `/api/*`

## Environment Variables

Make sure to set these environment variables in your Render dashboard:

1. `MONGODB_URI` - Your MongoDB connection string
2. `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
3. `CLOUDINARY_API_KEY` - Your Cloudinary API key
4. `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Select the `render.yaml` file
4. Set the required environment variables in the Render dashboard
5. Deploy!

## Troubleshooting

If you encounter issues:

1. Check that all environment variables are set correctly
2. Verify your MongoDB connection string is valid
3. Check Render logs for any error messages
4. Ensure Cloudinary credentials are correct

## URLs

After deployment, your application will be available at:
- Main URL: https://your-render-url.onrender.com
- API endpoints: https://your-render-url.onrender.com/api/*

For support, contact the development team.