# API Configuration

This document explains how the API is configured for different environments.

## Environment Variables

The application uses the `VITE_API_URL` environment variable to determine the API endpoint:

- In development: `http://localhost:5000/api`
- In production: `https://vmptime-backend.onrender.com/api`

## How API Calls Work

1. The [src/services/api.js](file:///g:/gadre/watch%20client/frontend/src/services/api.js) file uses `import.meta.env.VITE_API_URL || '/api'` as the base URL
2. In production, this resolves to `https://vmptime-backend.onrender.com/api`
3. All API calls are made directly to the backend (not proxied through Netlify)

## Troubleshooting API Issues

If you're getting 404 errors when making API calls:

1. **Verify the backend is running**:
   - Check that `https://vmptime-backend.onrender.com` is accessible
   - Verify that the API endpoints exist

2. **Check CORS configuration**:
   - The backend must allow requests from your frontend origin
   - For Netlify, this would be your `*.netlify.app` domain

3. **Verify environment variables**:
   - Make sure `VITE_API_URL` is correctly set in Netlify
   - Check that the value is `https://vmptime-backend.onrender.com/api`

## Netlify Configuration

The [netlify.toml](file:///g:/gadre/watch%20client/frontend/netlify.toml) file includes API proxying configuration, but since we're using environment variables, 
the requests go directly to the backend.

## Testing API Connection

You can test the API connection by:
1. Checking the browser console for error messages
2. Using the network tab to see the actual requests and responses
3. Running the test script in [src/test-api-connection.js](file:///g:/gadre/watch%20client/frontend/src/test-api-connection.js)