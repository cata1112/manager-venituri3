# Store Income Tracker - Deployment Instructions

## Files Included
- `index.html` - Main application file
- `style.css` - Stylesheet
- `app.js` - Application logic
- `firebase-config.js` - Firebase configuration (to be customized)

## Deployment Steps

1. Upload all files to your web hosting provider
2. Configure your domain's DNS to point to your hosting
3. Set up Firebase project with your custom domain
4. Update Firebase configuration in `firebase-config.js`

## Firebase Configuration
1. Create a project at https://console.firebase.google.com/
2. Add your custom domain to authorized domains
3. Enable Email/Password authentication
4. Get your Firebase config and update `firebase-config.js`