# Google OAuth Sign-In Setup Guide

## Overview
Your application now supports "Continue with Google" authentication. Users can sign in directly with their Google account.

## Setup Instructions

### 1. Create Google OAuth Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a Project" → "New Project"
   - Name it "CryptoSpaces" or your preferred name
   - Click "Create"

3. **Enable Google Sign-In API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity Services"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" (unless you have Google Workspace)
   - Fill in:
     - **App name**: CryptoSpaces
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

5. **Create OAuth Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Choose "Web application"
   - Name it "CryptoSpaces Web Client"
   - Add **Authorized JavaScript origins**:
     ```
     http://localhost:8080
     http://localhost:5500
     http://127.0.0.1:8080
     http://127.0.0.1:5500
     https://yourdomain.com  (your production domain)
     ```
   - Click "Create"
   - **Copy your Client ID** (looks like: `1234567890-abcdef.apps.googleusercontent.com`)

### 2. Update Your Code

Open `crypto-screener/dist/index.html` and find this line (around line 3789):

```html
data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID:

```html
data-client_id="1234567890-abcdef.apps.googleusercontent.com"
```

### 3. Test the Integration

1. **Open your application** in a browser
2. **Click the LOGIN button**
3. You should see:
   - "Continue with Google" button at the top
   - A divider with "ODER" (OR)
   - Traditional username/password fields below

4. **Click "Continue with Google"**
   - A Google Sign-In popup will appear
   - Select your Google account
   - Grant permissions
   - You'll be automatically logged in

## Features Implemented

### ✅ Google Sign-In Button
- Clean, professional Google-branded button
- "Continue with Google" text
- Positioned prominently at the top of the login modal

### ✅ Fallback Authentication
- Traditional username/password login still works
- Users can choose their preferred method

### ✅ User Data Storage
- User information is stored in `localStorage`
- Includes:
  - Name
  - Email
  - Profile picture (from Google)
  - Login method (Google or manual)
  - Member since date

### ✅ UI Updates
- Profile picture shown for Google users
- Automatic avatar creation for non-Google users
- Consistent user experience across login methods

## Security Notes

1. **Client ID is Public**: It's safe to include in your frontend code
2. **Use HTTPS in Production**: Always use HTTPS for production domains
3. **Validate Backend**: For production, validate the Google token on your backend
4. **Token Storage**: Currently using localStorage - consider more secure options for production

## Troubleshooting

### "Invalid Client ID" Error
- Check that your Client ID is correct in the HTML
- Verify authorized origins match your current URL

### Button Not Showing
- Check browser console for errors
- Ensure Google Sign-In script is loading
- Verify internet connection

### "Popup Blocked"
- Allow popups in browser settings
- Try clicking the button again

## Next Steps for Production

1. **Backend Validation**
   ```javascript
   // Verify the token on your backend
   const ticket = await client.verifyIdToken({
       idToken: token,
       audience: CLIENT_ID
   });
   ```

2. **Add to dashboard.html**
   - The same Google Sign-In can be added to dashboard.html
   - Copy the same implementation

3. **Database Integration**
   - Store user data in a proper database
   - Link Google account to user subscriptions

4. **Session Management**
   - Implement proper session handling
   - Add token refresh logic

## Testing Checklist

- [ ] Google Sign-In button appears in login modal
- [ ] Clicking button opens Google popup
- [ ] Successful login closes modal and shows user info
- [ ] User avatar shows Google profile picture
- [ ] Logout works correctly
- [ ] Page refresh maintains login state
- [ ] Traditional login still works

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Client ID is correctly set
3. Ensure authorized origins include your current URL
4. Check Google Cloud Console for any errors

---

**Your application now has modern, secure Google Sign-In! 🚀**
