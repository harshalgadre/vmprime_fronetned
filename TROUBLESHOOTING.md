# Troubleshooting Guide

This guide helps you resolve common issues with the NTRO.IO e-commerce platform.

## Common Issues and Solutions

### 1. "Failed to save product" Error (500 Internal Server Error)

**Problem**: When trying to add or edit a product in the admin panel, you get a "Failed to save product" error.

**Solutions**:

#### Check MongoDB Connection
1. Ensure MongoDB is running:
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl status mongod
   ```

2. Verify your MongoDB URI in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ntroio
   ```

3. Test the connection:
   ```bash
   cd backend
   npm run test:connection
   ```

#### Check Cloudinary Configuration
1. Ensure you have valid Cloudinary credentials in `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. Create a free Cloudinary account at https://cloudinary.com/ if you haven't already

#### Check Backend Server
1. Ensure the backend server is running:
   ```bash
   cd backend
   npm start
   ```

2. Check for error messages in the terminal/console

### 2. "No Products Found" Message

**Problem**: The shop page shows "No Products Found" even though you've added products.

**Solutions**:

1. Check if the backend server is running
2. Verify MongoDB connection
3. Check browser console for API errors:
   - Open Developer Tools (F12)
   - Go to Network tab
   - Refresh the page
   - Look for failed requests to `/api/products`

### 3. Images Not Uploading

**Problem**: Product images are not uploading or not displaying correctly.

**Solutions**:

1. Verify Cloudinary credentials are correct
2. Check if you have internet connectivity
3. Ensure the image file size is not too large (Cloudinary free tier has limits)
4. Check browser console for upload errors

### 4. Admin Panel Not Working

**Problem**: Admin panel shows errors or doesn't load data.

**Solutions**:

1. Ensure you're accessing the admin panel at the correct URL:
   `http://localhost:5173/admin`

2. Check that the backend server is running on port 5000

3. Verify admin authentication is working by checking requests in browser dev tools

### 5. Contact Form Not Working

**Problem**: Contact form submissions fail or don't redirect to WhatsApp.

**Solutions**:

1. Ensure the backend server is running
2. Check browser console for errors on form submission
3. Verify the backend can connect to MongoDB

## Testing Your Setup

### 1. Test Database Connection
```bash
cd backend
npm run test:connection
```

### 2. Test API Endpoints
```bash
cd backend
npm run test:api
```

### 3. Check Server Logs
Look at the terminal where you started the backend server for any error messages.

## Environment Variables

Make sure your `backend/.env` file contains:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ntroio
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Port Conflicts

If you get an "EADDRINUSE" error:

1. Check if another process is using port 5000:
   ```bash
   # On Windows
   netstat -ano | findstr :5000
   
   # On macOS/Linux
   lsof -i :5000
   ```

2. Kill the conflicting process or change the port in `.env`:
   ```env
   PORT=5001
   ```

## MongoDB Issues

### Starting MongoDB
```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
```

### Creating the Database
The application will automatically create the "ntroio" database when you first add a product.

## Cloudinary Issues

### Free Tier Limits
- 25 credits
- 10 GB storage
- 25,000 transformations

If you exceed these limits, you'll need to upgrade your Cloudinary account.

## Browser Issues

### Clear Cache
Sometimes cached files can cause issues:
1. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Try in an incognito/private window

### Browser Compatibility
The application works best in modern browsers:
- Chrome 80+
- Firefox 74+
- Safari 13+
- Edge 80+

## Development Tools

### Check Network Requests
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Perform the action that's failing
4. Look for failed requests (red entries)
5. Check the request/response details

### Check Console Errors
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages (red text)
4. These often contain clues about what's wrong

## Still Having Issues?

1. **Check the server logs** - Look at the terminal where you started the backend
2. **Verify all services are running** - MongoDB, backend server
3. **Check environment variables** - Make sure all required values are set
4. **Test individual components** - Use the test scripts provided
5. **Look at browser dev tools** - Network and Console tabs often show the real error

If you're still having issues, please provide:
1. The exact error message
2. Screenshots of browser console/network tabs
3. Server logs
4. Your environment variable values (without secrets)