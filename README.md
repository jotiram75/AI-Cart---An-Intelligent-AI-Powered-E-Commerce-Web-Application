# AICart - AI Powered E-Commerce Application

AICart is a modern, AI-powered e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a comprehensive admin panel, user authentication, and a dynamic frontend.

## 🚀 Key Features

- **Storefront**: Modern, responsive UI with advanced product filtering, search, and a premium product detail page.
- **Admin Dashboard**: Refined, high-contrast dashboard with real-time stats and quick actions.
- **Product Management**: Full CRUD functionality, including a newly implemented **Product Edit** feature with image upload support.
- **Image Intelligence**: Cloudinary integration for optimized image management.
- **Order Flow**: Complete checkout process with Razorpay payment integration.
- **User Experience**: Mobile-first design, smooth transitions, and intuitive navigation.

## 📁 Project Structure

```text
AICart/
├── admin/                # Admin Dashboard (Vite + React)
│   ├── src/
│   │   ├── component/    # Reusable UI components (Nav, Sidebar, etc.)
│   │   ├── context/      # Admin and Auth state management
│   │   ├── pages/        # Dashboard, Add Product, Edit Product, Lists, Orders
│   │   └── App.jsx       # Admin routing and layout
├── backend/              # Node.js/Express API Server
│   ├── config/           # DB, Cloudinary, and other configurations
│   ├── controller/       # Business logic for Auth, Orders, Products, and Vendors
│   ├── middleware/       # Authentication (Admin/Vendor) and File Upload (Multer)
│   ├── model/            # MongoDB Schemas (User, Product, Order, Vendor)
│   ├── routes/           # API Endpoints
│   └── index.js          # Server entry point
└── frontend/             # Customer-Facing Application (Vite + React)
    ├── src/
    │   ├── component/    # Storefront components (Hero, RelatedProducts, etc.)
    │   ├── context/      # Frontend state (Cart, Search, Shop)
    │   ├── pages/        # Home, Collections, Product Details, Cart, Checkout
    │   └── App.jsx       # Main application routing
```

## 🛠️ Getting Started

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

## 🚀 Deployment

This project is optimized for deployment on Vercel.

1.  **Backend:** Deploy the `backend` directory. Ensure to set all environment variables in Vercel.
2.  **Frontend:** Deploy the `frontend` directory. Set `VITE_SERVER_URL` to your deployed backend.
3.  **Admin:** Deploy the `admin` directory. Set `VITE_SERVER_URL` to your deployed backend.
