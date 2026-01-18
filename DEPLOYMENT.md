# BinteShauq - Deployment Guide

## Vercel Deployment Setup

### 1. Environment Variables

Add these environment variables in your Vercel dashboard under **Settings > Environment Variables**:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key
```

### 2. Database Setup

For production, you need a PostgreSQL database. Recommended options:

- **Vercel Postgres** (recommended for Vercel deployments)
- **Supabase** (free tier available)
- **PlanetScale** (free tier available)
- **Railway** (free tier available)

### 3. Database Migration

After setting up your PostgreSQL database:

1. Update your `DATABASE_URL` in Vercel environment variables
2. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Seed your database (optional):
   ```bash
   npx prisma db seed
   ```

### 4. Build Configuration

The project is configured with:
- ✅ Fixed Next.js config warnings
- ✅ Dynamic pages to avoid build-time database calls
- ✅ Proper Prisma client configuration
- ✅ Error handling for database connections

### 5. Local Development

For local development, the project uses SQLite:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### 6. Troubleshooting

**Build Timeout Issues:**
- Pages are now marked as `dynamic = 'force-dynamic'` to avoid build-time database calls
- Database queries have proper error handling

**Database Connection Issues:**
- Ensure `DATABASE_URL` is correctly set in Vercel
- Check that your PostgreSQL database is accessible from Vercel's IP ranges
- Verify database credentials are correct

**Prisma Issues:**
- Run `npx prisma generate` after any schema changes
- Ensure database migrations are up to date
