# API Endpoint Fix for Product Management

## Issue Description

The admin panel was failing to save products with the error:
```
Failed to save product: Error: <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page not found</title>
    ...
```

This indicated that API requests were being sent to incorrect endpoints, resulting in HTML "Page not found" responses instead of JSON API responses.

## Root Cause

The ProductsPage component was using hardcoded URLs for direct fetch calls instead of using the centralized API service configuration. Specifically:

1. It was using `import.meta.env.DEV ? 'https://vmptime-backend.onrender.com/api' : '/api'` 
2. This approach was inconsistent with the API service that properly handles environment variables
3. When the environment variable `VITE_API_URL` was set, these direct calls were ignoring it

## Solution

Updated all direct fetch calls in [src/pages/admin/ProductsPage.tsx](file:///g:/gadre/watch%20client/frontend/src/pages/admin/ProductsPage.tsx) to use the same API base URL logic as the centralized API service:

```typescript
// Use the API service base URL
const baseUrl = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://vmptime-backend.onrender.com/api' : '/api');
```

## Changes Made

1. **Fixed 4 direct fetch calls** in the ProductsPage component:
   - Color image upload endpoint
   - Product update endpoint (with image)
   - Product create endpoint (with image)
   - Color image upload for new products

2. **Fixed TypeScript error handling** by adding `: any` type annotations to catch blocks

3. **Maintained consistency** with the API service configuration logic

## How It Works

The updated logic now:
1. Uses `VITE_API_URL` environment variable when set (highest priority)
2. Falls back to `https://vmptime-backend.onrender.com/api` in production when env var is not set
3. Uses `/api` in development when neither env var nor production mode is set

## Testing

The fix has been tested by:
1. Running a successful build
2. Verifying the logic change matches the API service configuration
3. Ensuring all direct fetch calls now use the proper base URL

After deploying this fix, product management in the admin panel should work correctly, with API requests being sent to the proper endpoints.