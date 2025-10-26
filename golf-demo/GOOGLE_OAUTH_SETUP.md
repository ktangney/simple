# Google OAuth Setup Guide

This app uses Google OAuth for authentication. Follow these steps to set up Google OAuth credentials.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step-by-Step Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Golf Score Tracker")
5. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, select your project
2. Go to "APIs & Services" > "Library"
3. Search for "Google+ API"
4. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required fields:
   - App name: Golf Score Tracker
   - User support email: Your email
   - Developer contact information: Your email
5. Click "Save and Continue"
6. Skip "Scopes" (click "Save and Continue")
7. Add test users (your email and any others you want to test with)
8. Click "Save and Continue"
9. Review and click "Back to Dashboard"

### 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Name it "Golf Score Tracker Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:5173`
6. Add Authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback`
7. Click "Create"
8. A dialog will appear with your Client ID and Client Secret
   - **Copy these values - you'll need them next!**

### 5. Update Backend Environment Variables

1. Navigate to `backend/.env` file
2. Replace the placeholder values with your credentials:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

3. Save the file

### 6. Restart the Backend Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm start
```

### 7. Test the Authentication

1. Make sure both frontend and backend are running
2. Open http://localhost:5173 in your browser
3. Click "Sign in with Google"
4. You should be redirected to Google's login page
5. After signing in, you'll be redirected back to the app

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches:
  `http://localhost:3001/auth/google/callback`
- Check for trailing slashes or typos

### Error: "Access blocked: This app's request is invalid"
- Make sure you've added yourself as a test user in the OAuth consent screen
- Try using an incognito window

### Error: "invalid_client"
- Double-check your Client ID and Client Secret in `.env`
- Make sure there are no extra spaces or quotes

### Sessions not persisting
- Make sure `credentials: 'include'` is set in all fetch requests
- Check that CORS is properly configured with credentials

## Production Deployment

When deploying to production:

1. Update the `.env` file with production URLs:
```env
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
NODE_ENV=production
```

2. In Google Cloud Console, add production URLs to:
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://api.your-domain.com/auth/google/callback`

3. Submit your app for verification if you want to remove the "unverified app" warning

## Security Notes

- **Never commit your `.env` file to version control!**
- The `.env` file is already in `.gitignore`
- Only share credentials through secure channels
- Rotate credentials if they are ever exposed
- Use different credentials for development and production
