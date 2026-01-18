# 🛍️ Karandi Shawl E-commerce Store - Admin Panel

A comprehensive admin panel for managing your karandi shawl e-commerce store with full CRUD operations, analytics, and user management.

## 🚀 Features

### 📊 **Dashboard & Analytics**
- **Real-time Statistics**: Total users, products, orders, and revenue
- **Growth Metrics**: Month-over-month growth comparisons
- **Interactive Charts**: Sales trends, user growth, and product performance
- **Visual Analytics**: Bar charts, line charts, and pie charts using Recharts
- **Recent Activity**: Latest orders and user activities

### 🛒 **Product Management**
- **Full CRUD Operations**: Create, read, update, and delete products
- **Bulk Operations**: Manage multiple products efficiently
- **Stock Management**: Toggle product availability and track inventory
- **Image Management**: Upload and manage product images
- **Category Management**: Organize products by collections
- **Search & Filter**: Find products quickly with advanced filtering

### 📦 **Order Management**
- **Order Tracking**: Monitor order status and fulfillment
- **Status Updates**: Change order status (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled)
- **Customer Information**: View customer details and shipping information
- **Order History**: Complete order timeline and updates
- **Payment Tracking**: Monitor payment status and methods

### 👥 **User Management**
- **User Profiles**: View and manage user accounts
- **Role Management**: Assign admin privileges and manage permissions
- **User Analytics**: Track user registration and activity
- **Account Management**: Update user information and preferences
- **Order History**: View user's order history and preferences

### 📈 **Reports & Analytics**
- **Sales Reports**: Detailed sales performance and trends
- **Product Reports**: Top-selling products and inventory analysis
- **User Reports**: User registration and activity reports
- **Custom Date Ranges**: Generate reports for specific periods
- **Export Functionality**: Download reports in various formats

### ⚙️ **Settings & Configuration**
- **Store Settings**: Configure store information and preferences
- **System Settings**: Manage maintenance mode and system behavior
- **Security Settings**: Configure access controls and security features
- **Regional Settings**: Set currency, timezone, and localization
- **Database Management**: Monitor database status and backups

## 🛠️ **Technical Features**

### 🔐 **Authentication & Authorization**
- **Role-based Access**: Admin-only access with proper authentication
- **Secure Sessions**: JWT-based session management
- **Password Security**: Bcrypt encryption for all passwords
- **API Protection**: Secure API endpoints with role verification

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first responsive admin panel
- **Dark/Light Mode**: Toggle between themes
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns
- **Intuitive Navigation**: Easy-to-use sidebar and breadcrumb navigation

### 📱 **Mobile Responsive**
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Tables**: Mobile-optimized data tables
- **Adaptive Layouts**: Flexible grid systems for all screen sizes

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sadia-ismail-e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Create an admin user**
   ```bash
   # Use the signup page or create directly in database
   # Make sure to set role: "ADMIN" for admin access
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the admin panel**
   ```
   http://localhost:3000/admin
   ```

## 📋 **Admin Panel Structure**

```
/admin
├── /                    # Dashboard with statistics
├── /products           # Product management
├── /orders             # Order management  
├── /users              # User management
├── /analytics          # Detailed analytics
├── /reports            # Report generation
└── /settings           # System settings
```

## 🔧 **API Endpoints**

### Admin API Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/[id]` - Update order status
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[id]` - Update user role
- `GET /api/admin/analytics` - Analytics data

## 🎯 **Key Features Explained**

### **Dashboard Analytics**
- Real-time metrics with growth indicators
- Interactive charts showing sales trends
- Quick access to recent orders and activities
- Performance indicators with visual feedback

### **Product Management**
- Complete product lifecycle management
- Bulk operations for efficiency
- Image upload and management
- Stock level monitoring and alerts
- Category and collection organization

### **Order Processing**
- Visual order status tracking
- Customer communication tools
- Payment status monitoring
- Shipping and fulfillment tracking
- Order history and analytics

### **User Administration**
- User account management
- Role and permission assignment
- User activity monitoring
- Account security management
- Customer support tools

## 🔒 **Security Features**

- **Role-based Access Control**: Only admin users can access the panel
- **API Authentication**: All admin endpoints require authentication
- **Data Validation**: Input validation and sanitization
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js CSRF protection

## 📊 **Database Schema**

The admin panel works with the following main entities:
- **Users**: Customer and admin accounts
- **Products**: Product catalog and inventory
- **Orders**: Customer orders and fulfillment
- **OrderItems**: Individual order line items
- **CartItems**: Shopping cart management

## 🎨 **UI Components**

Built with modern React components:
- **shadcn/ui**: Beautiful, accessible components
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Interactive data visualization
- **Lucide React**: Consistent iconography
- **React Hot Toast**: User feedback notifications

## 🚀 **Deployment**

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
```

## 📈 **Performance Optimizations**

- **Server-side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for better performance
- **Caching**: Efficient data caching strategies
- **Database Optimization**: Optimized queries and indexing

## 🔧 **Customization**

### Adding New Features
1. Create new API routes in `/app/api/admin/`
2. Add new pages in `/app/admin/`
3. Update navigation in `admin-sidebar.tsx`
4. Add new components in `/components/admin/`

### Styling Customization
- Modify Tailwind classes for styling
- Update theme colors in `globals.css`
- Customize component styles in `/components/ui/`

## 📞 **Support**

For support and questions:
- Check the documentation
- Review the code comments
- Test in development environment first
- Use browser developer tools for debugging

## 🎉 **Conclusion**

This admin panel provides a complete solution for managing your karandi shawl e-commerce store. With its modern design, comprehensive features, and robust security, you can efficiently manage products, orders, users, and analytics all from one centralized dashboard.

The responsive design ensures you can manage your store from any device, while the intuitive interface makes it easy for anyone to use, regardless of technical expertise.

---

**Built with ❤️ using Next.js, React, TypeScript, Prisma, and shadcn/ui**
