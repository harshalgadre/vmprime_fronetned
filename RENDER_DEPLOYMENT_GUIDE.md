# Render Deployment Guide

This guide explains how to deploy the VM Prime frontend application to Render.

## Prerequisites

1. A Render account (https://render.com)
2. The backend API deployed and running (https://vmptime-backend.onrender.com)

## Deployment Steps

### 1. Connect Repository to Render

1. Go to your Render Dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub/GitLab repository
4. Configure the following settings:
   - **Name**: vm-prime-frontend
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 2. Environment Variables

The following environment variables are already configured in [render.yaml](file:///g:/gadre/watch%20client/frontend/render.yaml):

- `VITE_API_URL`: https://vmptime-backend.onrender.com/api

### 3. Routing Configuration

The [render.json](file:///g:/gadre/watch%20client/frontend/render.json) file contains the routing configuration:

- All API requests (`/api/*`) are proxied to the backend
- All other requests are served the `index.html` file for client-side routing

### 4. Deploy

1. Click "Create Static Site"
2. Render will automatically build and deploy your application
3. Your site will be available at `https://your-app-name.onrender.com`

## Custom Domain (Optional)

1. In your Render dashboard, go to your static site
2. Click "Settings" → "Custom Domains"
3. Follow Render's instructions to add your custom domain

## Troubleshooting

### Common Issues

1. **API Connection Errors**: 
   - Verify the backend is running at https://vmptime-backend.onrender.com
   - Check that the `VITE_API_URL` environment variable is correctly set

2. **Routing Issues**:
   - Ensure [render.json](file:///g:/gadre/watch%20client/frontend/render.json) is properly configured
   - Check that all client-side routes are handled by `index.html`

### Logs

To view deployment logs:
1. Go to your Render dashboard
2. Select your static site
3. Click "Logs" to view build and runtime logs

## Updating the Deployment

Render automatically redeploys your site when you push changes to your connected repository. To manually trigger a deployment:

1. Go to your Render dashboard
2. Select your static site
3. Click "Manual Deploy" → "Deploy Latest Commit"