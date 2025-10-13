# Testing Guide - Cart & Checkout

## Quick Test Steps

### 1. Test Add to Cart
1. Navigate to `http://localhost:3001`
2. Sign in (or create an account if needed)
3. Browse products on the home page
4. Click "Add to Cart" on any product card
5. ✅ You should see a success toast notification
6. ✅ Cart icon in header should update with item count

### 2. Test Cart Page
1. Click on the cart icon in the header or go to `/cart`
2. ✅ You should see your added items
3. Try clicking the + and - buttons to change quantity
4. ✅ Price should update automatically
5. Try clicking the trash icon to remove an item
6. ✅ Item should be removed immediately

### 3. Test Product Detail Page
1. Click on any product to go to its detail page
2. ✅ You should see two buttons: "Add to Cart" and "Buy Now"
3. Click "Add to Cart"
4. ✅ Success toast should appear
5. Click "Buy Now"
6. ✅ Should add to cart and redirect to checkout

### 4. Test Checkout with COD
1. Go to cart page (`/cart`)
2. Click "Proceed to Checkout"
3. Fill in the form with test data:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 03001234567
   - Address: 123 Test Street
   - City: Karachi
   - State: Sindh
   - Zip Code: 75000
   - Country: Pakistan
4. Make sure "Cash on Delivery (COD)" is selected
5. Click "Place Order"
6. ✅ Order should be created successfully
7. ✅ Cart should be cleared
8. ✅ You should be redirected to order confirmation page

### 5. Test Admin Panel
1. Sign in as admin (user with role "ADMIN")
2. Go to `/admin/orders`
3. ✅ You should see the order you just created
4. ✅ Order should show:
   - Customer name and email
   - Order status: PENDING
   - Payment method: COD
   - Payment status: PENDING
   - Total amount
5. Try updating the order status using the dropdown
6. ✅ Status should update immediately

## Create Admin User

If you don't have an admin user, you can create one using Prisma Studio:

```bash
npx prisma studio
```

1. Open Prisma Studio (usually at `http://localhost:5555`)
2. Go to the "User" model
3. Find your user and click on it
4. Change the "role" field from "USER" to "ADMIN"
5. Click "Save 1 change"

Or use SQL directly in your Neon database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Troubleshooting

### Cart not working?
- Make sure you're signed in
- Check browser console for errors (F12)
- Verify the dev server is running without errors

### Orders not creating?
- Make sure all required fields are filled in the checkout form
- Check the terminal for API errors
- Verify DATABASE_URL is correctly set in .env

### Admin panel not showing orders?
- Make sure your user has role "ADMIN"
- Sign out and sign back in after changing role
- Check console for 401 errors

## Files Modified

### Fixed Issues:
1. ✅ `/app/page.tsx` - Fixed fetch URL issue
2. ✅ `/lib/auth.ts` - Removed conflicting PrismaAdapter
3. ✅ `/app/api/cart/route.ts` - Fixed to use shared Prisma instance
4. ✅ `/app/api/cart/[productId]/route.ts` - Fixed to use shared Prisma instance
5. ✅ `/app/api/orders/route.ts` - Fixed to use shared Prisma instance
6. ✅ `/app/api/checkout/route.ts` - Added COD support
7. ✅ `/types/next-auth.d.ts` - Added missing `id` property

### New Files:
1. ✨ `/app/products/[slug]/product-actions.tsx` - Add to Cart & Buy Now buttons
2. 📝 `/CART_AND_CHECKOUT_README.md` - Complete documentation
3. 📝 `/TESTING_GUIDE.md` - This file

### Updated Files:
1. ✨ `/app/products/[slug]/page.tsx` - Now uses ProductActions component

## All Features Working ✅

- ✅ Add to Cart from product cards
- ✅ Add to Cart from product detail pages
- ✅ Cart page with quantity management
- ✅ Remove items from cart
- ✅ Checkout with delivery form
- ✅ Cash on Delivery (COD) payment
- ✅ Order creation
- ✅ Admin order management
- ✅ Order status updates
- ✅ PostgreSQL Neon database integration

## Success Indicators

When testing, look for these success indicators:

1. **Toast Notifications**: Green success toasts appear for actions
2. **Immediate Updates**: UI updates immediately after actions
3. **Cart Counter**: Header shows correct number of items
4. **Database Persistence**: Cart persists on page refresh
5. **Order Confirmation**: Successful redirect after order placement
6. **Admin View**: Orders appear in admin panel immediately

## Need Help?

If you encounter any issues:
1. Check the terminal for server errors
2. Check browser console (F12) for client errors
3. Verify environment variables in `.env` or `.env.local`
4. Make sure Prisma client is generated: `npx prisma generate`
5. Make sure database is synced: `npx prisma db push`

Happy testing! 🎉

