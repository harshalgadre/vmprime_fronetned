# Deployment Instructions

## Backend Deployment on Render

The backend is already deployed on Render at: https://localhost:5000/

### Environment Variables

For the backend to work properly, you need to set the following environment variables in your Render dashboard:

1. `MONGODB_URI` - Your MongoDB connection string
2. `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
3. `CLOUDINARY_API_KEY` - Your Cloudinary API key
4. `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
5. `PORT` - Set to 5000 (already configured in render.yaml)

### Setting Environment Variables on Render

1. Go to your Render dashboard
2. Click on your vm-prime-ewmh service
3. Go to "Environment" tab
4. Add the following key-value pairs:
   - `MONGODB_URI`: your_mongodb_connection_string
   - `CLOUDINARY_CLOUD_NAME`: your_cloudinary_cloud_name
   - `CLOUDINARY_API_KEY`: your_cloudinary_api_key
   - `CLOUDINARY_API_SECRET`: your_cloudinary_api_secret

## Frontend Deployment

The frontend should be deployed separately and configured to use the backend API at https://localhost:5000/api

All API calls in the frontend have been updated to use this URL.

## Testing the Deployment

You can test if the backend is working properly by visiting:
- https://localhost:5000/api - Should return {"message": "NTRO.IO Backend API"}
- https://localhost:5000/api/products - Should return a list of products

## Troubleshooting

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Verify MongoDB connection string is valid
3. Check Render logs for any error messages
4. Ensure Cloudinary credentials are correct

For support, contact the development team.