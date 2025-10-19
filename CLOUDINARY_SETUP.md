# Cloudinary Setup Guide

This guide explains how to set up Cloudinary for image storage in the NTRO.IO e-commerce platform.

## What is Cloudinary?

Cloudinary is a cloud-based service that provides an end-to-end image and video management solution. It includes upload, storage, manipulation, optimization, and delivery capabilities.

## Setting Up Cloudinary

### 1. Create a Cloudinary Account

1. Visit [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up Free"
3. Fill in your details and create an account
4. Verify your email address

### 2. Get Your Cloudinary Credentials

After logging in to your Cloudinary account:

1. Go to the Console/Dashboard
2. Find your:
   - **Cloud Name**: Appears in the URL path
   - **API Key**: A numeric key
   - **API Secret**: An alphanumeric secret key

### 3. Configure the Application

Update the `backend/.env` file with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Test the Integration

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Access the admin panel and try to add a product with an image
3. The image should be uploaded to your Cloudinary account

## How Cloudinary Integration Works

### Backend Implementation

1. **Image Upload Endpoint**: 
   - POST `/api/upload` handles direct image uploads
   - Uses `multer-storage-cloudinary` for seamless integration

2. **Product Creation/Update**:
   - When creating or updating products, images are automatically uploaded
   - Cloudinary URLs are stored in the database

3. **Image Deletion**:
   - When products are deleted, associated images are removed from Cloudinary
   - Prevents storage bloat

### Frontend Implementation

1. **Image Preview**:
   - Real-time preview of selected images
   - FileReader API for client-side previews

2. **Upload Handling**:
   - FormData for multipart uploads
   - Progress indicators during upload

## Cloudinary Features Used

### 1. Storage
- Images stored in the "ntroio_products" folder
- Automatic file naming with unique identifiers
- JPG format optimization

### 2. Organization
- Folder structure for easy management
- Public IDs for image identification
- Metadata storage

### 3. Security
- Signed uploads using API credentials
- Secure image URLs
- Access control through Cloudinary account

## Troubleshooting

### Common Issues

1. **Upload Failures**:
   - Check your API credentials in `.env`
   - Ensure Cloudinary account is active
   - Verify internet connectivity

2. **Image Not Displaying**:
   - Check Cloudinary dashboard for uploaded images
   - Verify the stored URL in the database
   - Ensure proper CORS configuration

3. **Delete Failures**:
   - Check Cloudinary logs for deletion errors
   - Verify public IDs are correct
   - Ensure API credentials have delete permissions

### Error Messages

- **"Invalid credentials"**: Check your Cloudinary API key and secret
- **"Upload failed"**: Check internet connection and Cloudinary status
- **"File too large"**: Compress images before upload or upgrade Cloudinary plan

## Cloudinary Pricing

Cloudinary offers a generous free tier:
- 25 credits (approximately 25,000 transformations or 25 GB storage)
- 10 GB storage
- 25,000 transformations
- 25,000 managed assets

For production use, you may need to upgrade based on your usage.

## Best Practices

### 1. Image Optimization
- Use appropriate image dimensions
- Compress images before upload
- Use Cloudinary's automatic format selection

### 2. Security
- Never expose API secrets in frontend code
- Use environment variables for credentials
- Regularly rotate API keys

### 3. Organization
- Use consistent folder structures
- Implement naming conventions
- Regularly clean up unused images

## Advanced Configuration

### Custom Transformations
You can apply Cloudinary transformations to images:

```javascript
// Example: Resize and crop images
const imageUrl = `https://res.cloudinary.com/your_cloud_name/image/upload/c_fill,h_300,w_300/${publicId}`;
```

### Responsive Images
Cloudinary supports responsive image delivery:

```html
<img src="https://res.cloudinary.com/your_cloud_name/image/upload/w_auto,dpr_auto/your_image_id" 
     alt="Product Image"
     class="w-full h-full object-cover">
```

## Migration from Placeholder Images

When you add real images:
1. Existing placeholder images will be replaced
2. New images will be uploaded to Cloudinary
3. Database will store Cloudinary URLs instead of placeholders

## Support

For issues with Cloudinary integration:
1. Check the [Cloudinary Documentation](https://cloudinary.com/documentation)
2. Review the application logs
3. Verify your Cloudinary account status
4. Contact Cloudinary support if needed

This Cloudinary integration provides scalable, reliable image storage for your e-commerce platform with minimal setup required.