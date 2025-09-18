# BiscuitBreaker Express - Render.com Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Update Google OAuth Settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://your-backend-name.onrender.com/api/auth/google/callback`
   - Replace `your-backend-name` with your actual Render service name

### 2. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## 🚀 Deployment Steps

### Option A: Blueprint Deployment (Recommended)
1. **Connect GitHub**: 
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" > "Blueprint"
   - Connect your GitHub repository
   - Select this repository

2. **Auto-Deploy**: 
   - Render will read `render.yaml` and create all services automatically
   - Database, backend, and frontend will be set up together

### Option B: Manual Deployment

1. **Create Database**:
   - New > PostgreSQL
   - Name: `biscuitbreaker-db`
   - Plan: Free
   - Region: Oregon

2. **Create Backend**:
   - New > Web Service
   - Connect GitHub repo
   - Name: `biscuitbreaker-backend`
   - Root Directory: `backend`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

3. **Create Frontend**:
   - New > Static Site
   - Connect GitHub repo  
   - Name: `biscuitbreaker-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`

## 🔧 Environment Variables (Backend)

Set these in your backend service environment variables:

```env
NODE_ENV=production
DATABASE_URL=[Auto-filled by Render]
SESSION_SECRET=[Generate random string]
GOOGLE_CLIENT_ID=82103457396-ghfe9hichc8ru7k6ijmmicnrcffu5id5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://your-backend-name.onrender.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-name.onrender.com
ALLOWLIST=bbreakergaming@gmail.com,vinay_rayana@srmap.edu.in,vinayrayana@gmail.com
```

## 🔧 Environment Variables (Frontend)

Set these in your frontend service environment variables:

```env
VITE_API_URL=https://your-backend-name.onrender.com
```

## 🗄️ Database Setup

After deployment, you'll need to run migrations:

1. Go to your backend service in Render
2. Open the Shell tab
3. Run: `npm run db:migrate`

## 🔄 Post-Deployment

1. **Test Authentication**: Try logging in with `bbreakergaming@gmail.com`
2. **Check Admin Access**: Should redirect to admin panel automatically
3. **Verify Database**: Check that user data is being saved properly

## 📊 Monitoring

- **Health Check**: `https://your-backend-name.onrender.com/api/health`
- **Auth Check**: `https://your-backend-name.onrender.com/api/auth/me`

## 🔄 Future Updates

After deployment, any pushes to your main branch will automatically trigger new deployments on Render.

## 🆘 Troubleshooting

**Common Issues:**
- OAuth redirect mismatch: Update Google OAuth settings
- Database connection: Check DATABASE_URL environment variable  
- CORS errors: Verify FRONTEND_URL is correctly set
- Session issues: Ensure SESSION_SECRET is set

**Logs**: Check service logs in Render dashboard for detailed error messages.