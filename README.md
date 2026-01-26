# AICart - AI Powered E-Commerce Application

AICart is a modern, AI-powered e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a comprehensive admin panel, user authentication, and a dynamic frontend.

## Project Structure

The project is organized into three main directories:

- **frontend**: The customer-facing React application (Vite).
- **admin**: The administrative dashboard (Vite + React).
- **backend**: The Node.js/Express API server.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB account (for database)
- Cloudinary account (for image storage)
- Razorpay account (for payments)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd AICart
    ```

2.  **Install Dependencies:**

    *   **Backend:**
        ```bash
        cd backend
        npm install
        ```
    *   **Frontend:**
        ```bash
        cd ../frontend
        npm install
        ```
    *   **Admin:**
        ```bash
        cd ../admin
        npm install
        ```

### Configuration (.env)

You need to configure environment variables for each part of the application.

**Backend (.env):**
```env
PORT=8000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@aicart.com
ADMIN_PASSWORD=admin1234567
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_KEY_ID=your_razorpay_id
```

**Frontend (.env):**
```env
VITE_FIREBASE_APIKEY=your_firebase_key
VITE_RAZORPAY_KEY_ID=your_razorpay_id
VITE_SERVER_URL=http://localhost:8000
VITE_ADMIN_URL=http://localhost:5174
```

**Admin (.env):**
```env
VITE_SERVER_URL=http://localhost:8000
```

### Running the Application

1.  **Start Backend:**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Start Admin Panel:**
    ```bash
    cd admin
    npm run dev
    ```
3.  **Start Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

## Deployment on Vercel

This project is configured for deployment on Vercel.

1.  **Backend:** Deploy the `backend` directory. Ensure to set all environment variables in Vercel project settings.
2.  **Frontend:** Deploy the `frontend` directory. Set `VITE_SERVER_URL` to your deployed backend URL.
3.  **Admin:** Deploy the `admin` directory. Set `VITE_SERVER_URL` to your deployed backend URL.
