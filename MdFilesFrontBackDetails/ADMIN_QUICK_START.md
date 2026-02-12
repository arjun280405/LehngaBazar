# Admin Panel - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**

```bash
cd Backend
npm install socket.io
# Already have other dependencies
```

**Frontend:**

```bash
cd Frontend
npm install socket.io-client
# Already have other dependencies
```

### Step 2: Start the Application

**Terminal 1 - Backend:**

```bash
cd Backend
npm run dev
# Server running on http://localhost:8000
```

**Terminal 2 - Frontend:**

```bash
cd Frontend
npm run dev
# Frontend running on http://localhost:5173
```

### Step 3: Create Admin Account

1. Go to `http://localhost:5173/signup`
2. Fill in details:
   - Name: Your Name
   - Email: admin@example.com
   - Password: SecurePass123!
   - Confirm Password: SecurePass123!
3. **Important**: During registration, your role defaults to "customer"
4. To create an admin, you need to:
   - Use existing database to update role, OR
   - Modify registration form to accept role parameter

**For Now - Quick Admin Setup:**

Option A: Manually update in MongoDB

```javascript
// In MongoDB compass or terminal
db.users.findOneAndUpdate(
  { email: "admin@example.com" },
  { $set: { role: "admin" } },
);
```

Option B: Use POST request to create admin

```bash
curl -X POST http://localhost:8000/api/auth/registration \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "admin"
  }'
```

### Step 4: Login as Admin

1. Go to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Email: admin@example.com
   - Password: SecurePass123!
   - Role: Select "Admin"
3. Click "Login as Admin"
4. You should see Admin Dashboard

## 📊 Admin Dashboard Features

### Main Dashboard

- **Total Orders**: All orders count
- **Statistics**: Confirmed, Shipped, Delivered, Cancelled
- **Revenue**: Total earned from completed orders
- **Quick Actions**: Buttons to add products and view orders

### Product Management (`/admin/products`)

#### Add Product

1. Click "Add Product" button
2. Fill form:
   ```
   Product Title: "Lavish Purple Lehenga"
   Brand: "Lehenga Bazar"
   Category: "Lehenga" (dropdown)
   Price: 9999
   Description: "Beautiful lehenga for weddings"
   Main Image URL: "../assets/products/lehenga-01.avif"
   Inventory: 10
   ```
3. Click "Create Product"
4. Product appears immediately on customer site!

#### Edit Product

1. Go to product list
2. Click "Edit" button
3. Modify any field
4. Click "Update Product"
5. Changes sync in real-time

#### Delete Product

1. Go to product list
2. Click "Delete" button
3. Confirm deletion
4. Product removed from all customer views

### Order Management (`/admin/orders`)

#### View Orders

1. See all orders in a list
2. Click on order row to view details
3. See customer info, items, amount

#### Update Order Status

**Available Statuses:**

- `confirmed` - Order placed
- `processing` - Preparing to ship
- `shipped` - On the way
- `out-for-delivery` - With delivery partner
- `delivered` - Customer received
- `cancelled` - Order cancelled

**How to Update:**

1. Click on order in list
2. Select new status from dropdown
3. (Optional) Enter tracking number
4. Click "Update Order"
5. Customer gets instant notification!

**Example Workflow:**

```
Customer places order
  ↓
Admin: Click order → Select "processing"
  ↓
Admin: Select "shipped" → Add tracking number
  ↓
Customer: Sees real-time status update in "My Orders"
  ↓
Admin: Select "delivered"
  ↓
Customer: Gets delivery confirmation
```

## 👥 User Roles

### Customer

- Browse products
- Add to cart
- Place orders
- Track orders
- View my orders

### Admin

- All customer features PLUS
- Create/Edit/Delete products
- Update order status
- View all orders
- See dashboard stats

### Owner

- All admin features PLUS
- Can be super admin with all permissions

## 🔄 Real-Time Features

### How It Works

```
Admin updates order status
        ↓
Backend emits via Socket.io
        ↓
Customer's browser receives update
        ↓
My Orders page refreshes automatically
```

### No Page Refresh Needed!

- Products appear instantly when added
- Order status changes appear in real-time
- Multiple users can see updates simultaneously

## 🛠️ Common Tasks

### Task 1: Add 3 Products to Store

```bash
1. Go to /admin/products/add
2. Fill form for each product:
   - Purple Lehenga: Price 9999
   - Pink Lehenga: Price 8999
   - Gold Lehenga: Price 12999
3. Click Create Product
4. All appear on home page instantly!
```

### Task 2: Update Customer Order

```bash
1. Go to /admin/orders
2. Find order by customer name
3. Click on order
4. Select "shipped" status
5. Enter tracking: "TRACK123456"
6. Click Update
7. Customer sees update immediately!
```

### Task 3: View Dashboard Stats

```bash
1. Go to /admin/dashboard
2. See all statistics
3. Click "Refresh Stats" to update
```

## ✅ What's Working

✅ Admin login with role selection
✅ Product CRUD (Create, Read, Update, Delete)
✅ Real-time product sync to customer site
✅ Order status management
✅ Real-time order status notifications
✅ Dashboard with statistics
✅ Search products
✅ Filter orders by status
✅ Socket.io real-time updates

## ⚠️ Known Limitations

- Authentication currently simple (email/password)
- No two-factor authentication yet
- Admin password rules strict (uppercase, lowercase, number, symbol)
- Image URLs must be valid paths
- No file upload (using URL paths)

## 🔐 Security Notes

- JWT token stored in localStorage
- Token expires after 7 days
- Password hashed with bcryptjs
- Admin routes protected with middleware
- Role-based authorization on all admin endpoints

## 🐛 Troubleshooting

### "Admin access required" Error

- Check user role in database is "admin"
- Re-login after role update
- Clear localStorage and try again

### Products not showing on customer site

- Check product.isActive = true
- Verify image URL is correct
- Clear browser cache

### Order updates not real-time

- Check Socket.io is connected (browser console)
- Verify backend is running
- Check customer is logged in

### Can't login as admin

- Verify email and password correct
- Check role is "admin" in database
- Check token in localStorage

## 📱 Responsive Design

- ✅ Desktop fully responsive
- ✅ Tablet optimized
- ✅ Mobile friendly admin panels
- ✅ Touch-friendly buttons

## 🎯 Next Steps

1. **Create test admin account**
2. **Add 3-5 test products**
3. **Place order as customer**
4. **Update order status as admin**
5. **See real-time update as customer**

## 📞 Support

Check these files for more info:

- [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md) - Detailed documentation
- Backend logs for API errors
- Browser console for frontend errors

---

**Enjoy your admin panel! 🎉**
