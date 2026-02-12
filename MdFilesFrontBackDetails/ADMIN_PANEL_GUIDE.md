# Admin Panel Implementation Guide

## Overview

A complete admin panel system has been implemented with role-based access control, product management, and real-time order status tracking.

## Features Implemented

### 1. **Role-Based Authentication**

- Users can register with roles: `customer`, `admin`, or `owner`
- Login with role selection in admin panel
- Token-based JWT authentication
- Protected admin routes

### 2. **Product Management**

- **Create Products**: Add new products with image URLs, pricing, inventory
- **Read Products**: View all public products and admin-created products
- **Update Products**: Edit product details and pricing
- **Delete Products**: Soft delete (deactivate) products
- **Real-time Sync**: Changes reflect immediately on customer pages via Socket.io

### 3. **Order Management**

- **View Orders**: Admin can see all orders with customer details
- **Update Status**: Change order status through workflow:
  - Confirmed → Processing → Shipped → Out for Delivery → Delivered
  - Cancel orders when needed
- **Tracking**: Add tracking numbers to orders
- **Real-time Updates**: Customers receive instant notifications of status changes

### 4. **Admin Dashboard**

- Order statistics (confirmed, processing, shipped, delivered, cancelled)
- Revenue tracking
- Quick navigation to products and orders
- Admin product count

## File Structure

### Backend Files Created/Updated

#### Models

- **[Backend/model/productModel.js](Backend/model/productModel.js)** - Product schema with inventory tracking
- **[Backend/model/userModel.js](Backend/model/userModel.js)** - Updated with role field
- **[Backend/model/orderModel.js](Backend/model/orderModel.js)** - Already supports status tracking

#### Controllers

- **[Backend/controller/productController.js](Backend/controller/productController.js)** - Product CRUD operations
- **[Backend/controller/adminOrderController.js](Backend/controller/adminOrderController.js)** - Order management
- **[Backend/controller/authController.js](Backend/controller/authController.js)** - Updated registration for roles

#### Middleware

- **[Backend/middleware/authMiddleware.js](Backend/middleware/authMiddleware.js)** - Authentication & authorization

#### Routes

- **[Backend/routes/productRoutes.js](Backend/routes/productRoutes.js)** - Product endpoints
- **[Backend/routes/adminOrderRoutes.js](Backend/routes/adminOrderRoutes.js)** - Admin order endpoints

#### Configuration

- **[Backend/index.js](Backend/index.js)** - Updated with Socket.io setup
- **[Backend/package.json](Backend/package.json)** - Added socket.io dependency

### Frontend Files Created/Updated

#### Pages

- **[Frontend/src/pages/AdminLogin.jsx](Frontend/src/pages/AdminLogin.jsx)** - Admin login with role selection
- **[Frontend/src/pages/AdminDashboard.jsx](Frontend/src/pages/AdminDashboard.jsx)** - Dashboard with stats
- **[Frontend/src/pages/AdminProducts.jsx](Frontend/src/pages/AdminProducts.jsx)** - Product management list
- **[Frontend/src/pages/AdminAddProduct.jsx](Frontend/src/pages/AdminAddProduct.jsx)** - Add/Edit product form
- **[Frontend/src/pages/AdminOrders.jsx](Frontend/src/pages/AdminOrders.jsx)** - Order management with status updates

#### Context

- **[Frontend/src/context/AuthContext.jsx](Frontend/src/context/AuthContext.jsx)** - Updated with Socket.io integration

#### Components

- **[Frontend/src/components/Navbar.jsx](Frontend/src/components/Navbar.jsx)** - Added admin panel link

#### Configuration

- **[Frontend/src/App.jsx](Frontend/src/App.jsx)** - Added admin routes
- **[Frontend/package.json](Frontend/package.json)** - Added socket.io-client dependency

## How to Use

### For Admins (First Time Setup)

1. **Create Admin Account** (During Registration):
   - Go to `/signup` or `/admin/login`
   - Set role as `admin` or `owner` during signup
   - Complete registration

2. **Login to Admin Panel**:
   - Visit `/admin/login`
   - Select "Admin" or "Owner" role
   - Enter credentials
   - Redirected to admin dashboard

### For Admin - Product Management

1. **Add New Product**:

   ```
   Navigate: Admin Dashboard → Manage Products → Add Product
   Fields required:
   - Product Title
   - Brand
   - Category (Lehenga/Haldi/Mehndi/Bridal/Traditional)
   - Price
   - Description
   - Main Image URL
   - Inventory
   ```

2. **View Products**:
   - See all products created by you
   - Search by name or brand
   - View inventory status

3. **Edit Product**:
   - Click "Edit" button on product
   - Update any details
   - Changes reflect instantly on customer site

4. **Delete Product**:
   - Click "Delete" button
   - Soft delete - product deactivated
   - Product disappears from customer view

### For Admin - Order Management

1. **View All Orders**:

   ```
   Navigate: Admin Dashboard → Manage Orders
   ```

2. **Filter Orders by Status**:
   - All Orders
   - Confirmed
   - Processing
   - Shipped
   - Out for Delivery
   - Delivered
   - Cancelled

3. **Update Order Status**:
   - Click order to view details
   - Select new status from dropdown
   - (Optional) Add tracking number
   - Click "Update Order"
   - Customer gets instant notification

### For Customers - Real-Time Updates

1. **Automatic Notifications**:
   - When admin updates order status
   - Socket.io connection sends real-time update
   - Customer sees status change in "My Orders"

2. **Track Orders**:
   - View order status in "My Orders" page
   - See tracking number if provided

## API Endpoints

### Authentication

```
POST /api/auth/registration     - Register with role
POST /api/auth/login            - Login (returns user with role)
```

### Products

```
GET    /api/products                    - Get all active products
GET    /api/products/:id                - Get single product
POST   /api/products                    - Create product (admin only)
PUT    /api/products/:id                - Update product (admin only)
DELETE /api/products/:id                - Delete product (admin only)
PATCH  /api/products/:id/deactivate     - Soft delete product
GET    /api/products/admin/my-products  - Get admin's products
```

### Admin Orders

```
GET    /api/admin/orders              - Get all orders
GET    /api/admin/orders/:id          - Get order by ID
PATCH  /api/admin/orders/:id/status   - Update order status
GET    /api/admin/orders/stats/overview - Get order statistics
```

## Real-Time Updates via Socket.io

### Client Connection

```javascript
// In AuthContext
socket.on("connect", () => {
  socket.emit("userJoined", userId);
});

// Customers listen for updates
socket.on("orderStatusUpdated", (data) => {
  // data = { orderId, status, trackingNumber }
});
```

### Server Emission

```javascript
// When admin updates order status
io.to(`user_${order.userId}`).emit("orderStatusUpdated", {
  orderId: order._id,
  status: order.status,
  trackingNumber: order.trackingNumber,
});
```

## Security Features

1. **Authentication Middleware**:
   - `verifyToken` - Checks valid JWT token
   - `isAdmin` - Allows admin/owner roles
   - `isOwner` - Allows only owner role

2. **Authorization Checks**:
   - Only admins can create/edit/delete products
   - Only admins can update order status
   - Users can only access their own data

3. **Protected Routes**:
   - Admin panel routes require authentication
   - Role verification on every admin API call

## Installation & Setup

### Backend

1. Install Socket.io:

```bash
cd Backend
npm install socket.io
```

2. Environment variables needed:

```
JWT_SECRET=your_secret_key
PORT=8000
```

3. Start server:

```bash
npm run dev
```

### Frontend

1. Install Socket.io client:

```bash
cd Frontend
npm install socket.io-client
```

2. Update Vite config if needed to use port 5173

3. Start frontend:

```bash
npm run dev
```

## Database Queries

### Get Admin Statistics

```javascript
// Total orders
Order.countDocuments();

// Orders by status
Order.countDocuments({ status: "shipped" });

// Revenue
Order.aggregate([
  { $match: { paymentStatus: "completed" } },
  { $group: { _id: null, total: { $sum: "$totalAmount" } } },
]);
```

### Get Admin Products

```javascript
Product.find({ createdBy: adminId }).sort({ createdAt: -1 });
```

## Workflow Examples

### Complete Order Workflow

1. **Customer places order** → Status: `confirmed`
2. **Admin reviews** → Status: `processing`
3. **Admin ships** → Status: `shipped` + tracking number
4. **In transit** → Status: `out-for-delivery`
5. **Delivered** → Status: `delivered`
6. **Customer sees real-time update** in My Orders page

### Product Addition Workflow

1. **Admin adds product** → Stored in database
2. **Socket.io emits** product creation event
3. **Appears on home page** instantly
4. **Shows in all categories** immediately
5. **Searchable** right away

## Testing

### Test Admin Access

1. Create account with role = "admin"
2. Visit `/admin/login`
3. Should see admin dashboard

### Test Product Creation

1. Login as admin
2. Add product
3. Logout
4. Login as customer
5. Product should appear on homepage/explore

### Test Order Updates

1. Place order as customer
2. Login as admin
3. Update order status
4. See real-time notification on customer page

## Troubleshooting

### Admin Login Not Working

- Check user role in database is "admin" or "owner"
- Verify JWT token is valid
- Check localStorage for token

### Socket.io Not Updating

- Verify Socket.io connection in browser console
- Check user joined correct room
- Verify backend emitting to correct room

### Products Not Showing

- Check product.isActive = true
- Verify createdBy user ID matches admin
- Clear browser cache

## Future Enhancements

1. **User Management**: View and manage all users
2. **Analytics**: Sales charts, top products
3. **Inventory Alerts**: Low stock notifications
4. **Bulk Operations**: Bulk edit/delete products
5. **Reports**: PDF export of orders
6. **Email Notifications**: Send status updates via email
7. **Product Categories**: Organize products better
8. **Admin Roles**: Different permission levels
9. **Audit Log**: Track all admin actions
10. **Multi-language Support**: Localization

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review error messages in browser console
3. Check backend logs for API errors
4. Verify database connections
