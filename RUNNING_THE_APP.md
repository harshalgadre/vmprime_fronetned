# Running the Complete Application

This document explains how to run both the frontend and backend of the NTRO.IO e-commerce watch store.

## Prerequisites

1. Node.js (version 14 or higher)
2. MongoDB (for the backend database)
3. Git (optional, for cloning the repository)

## Installing MongoDB

### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup instructions
3. Add MongoDB to your system PATH

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
```

### Ubuntu/Debian
```bash
sudo apt-get install mongodb
```

## Setting up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB (if not already running):
   ```bash
   mongod
   ```
   
   Or on Windows:
   ```bash
   "C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe" --dbpath="C:\data\db"
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend API will be available at: `http://localhost:5000`

## Setting up the Frontend

1. From the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## Seeding Initial Data

To populate the database with sample products:

1. Make sure the backend server is running
2. Run the seed script:
   ```bash
   node backend/seed.js
   ```

## API Endpoints

The backend provides the following API endpoints:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get a specific order (Admin)
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (Admin)

## Admin Authentication

For admin operations, include this header in your requests:
```
x-admin-auth: admin-secret-key
```

In a production environment, this would be replaced with a proper authentication system.

## Testing the API

You can test the API endpoints using the provided test script:
```bash
node backend/test-api.js
```

## Project Structure

```
ntro-io/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Middleware functions
│   ├── .env             # Environment variables
│   ├── server.js        # Main server file
│   ├── seed.js          # Sample data seeder
│   └── ...
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   └── ...
└── ...
```

## WhatsApp Integration

The contact form is integrated with WhatsApp. When a user submits the contact form, they are redirected to WhatsApp with a pre-filled message containing their form submission details.

## Payment Integration

For payment processing, you would need to integrate with a payment gateway like Stripe, PayPal, or Razorpay. The backend is designed to be easily extensible for adding payment functionality.

## Deployment

For deployment, you would typically:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the backend to a Node.js hosting service (e.g., Heroku, AWS, DigitalOcean)

3. Deploy the frontend build to a static hosting service (e.g., Netlify, Vercel, GitHub Pages)

4. Configure environment variables for production