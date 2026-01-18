# Sadia Ismail E-commerce

A modern, full-featured e-commerce platform for karandi shawls with authentication, cart functionality, and order management.

## Features

### 🔐 Authentication System
- User registration and login
- Secure password hashing with bcrypt
- Session management with NextAuth.js
- Protected routes and API endpoints

### 🛒 Shopping Cart
- Add/remove items from cart
- Update quantities
- Persistent cart storage
- Real-time cart count in header

### 💳 Payment Options
- **Cash on Delivery (COD)** - Pay when order is delivered
- **Stripe Integration** - Credit/debit card payments (ready for implementation)
- No direct redirect to Stripe admin panel

### 📦 Order Management
- Complete order placement flow
- Order history and tracking
- Detailed order views with timeline
- Order status updates (Pending, Confirmed, Processing, Shipped, Delivered)

### 👤 User Account Management
- User profile management
- Address and contact information
- Order history
- Account settings

### 🏠 Enhanced Homepage
- Hero section with featured products
- Product showcase with ratings
- About section
- Newsletter subscription
- Feature highlights (Free shipping, Quality guarantee, 24/7 support)

### 🛍️ Product Features
- Enhanced product cards with hover effects
- Quick add to cart functionality
- Product details and images
- Collection-based organization

### 🎨 Modern UI/UX
- Responsive design
- Beautiful animations and transitions
- Toast notifications
- Loading states
- Professional styling with Tailwind CSS
- Custom logo integration throughout the site

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **Payments**: Stripe (ready for integration)
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Seed the database**:
   ```bash
   npx tsx prisma/seed.ts
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses Prisma with SQLite and includes models for:
- Users (with profile information)
- Products (with images and collections)
- Cart items
- Orders and order items
- Authentication sessions and accounts

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/cart/*` - Cart management
- `/api/orders/*` - Order processing
- `/api/user/profile` - User profile management

## Pages

- `/` - Enhanced homepage
- `/shop` - Product catalog
- `/products/[slug]` - Individual product pages
- `/cart` - Shopping cart
- `/checkout` - Order placement
- `/orders` - Order history
- `/orders/[id]` - Order details
- `/account` - User profile
- `/auth/signin` - Sign in page
- `/auth/signup` - Registration page

## Key Features Implemented

✅ **Authentication System** - Complete sign up/sign in flow
✅ **Enhanced Homepage** - Rich content with featured products
✅ **Product Cards** - Interactive cards with add to cart
✅ **COD Payment Option** - Cash on delivery functionality
✅ **User Account System** - Profile management and order history
✅ **Shopping Cart** - Full cart functionality with continue shopping
✅ **Order Management** - Complete order lifecycle

## Production Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set up environment variables for NextAuth.js
2. Configure your database (PostgreSQL recommended for production)
3. Set up Stripe keys for payment processing
4. Configure email service for notifications

## Contributing

This is a complete e-commerce solution with all requested features implemented. The codebase is well-structured, type-safe, and follows modern React/Next.js best practices.
# BinteShauq
