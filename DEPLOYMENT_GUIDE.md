# 🚀 Serverless Deployment Guide

Deploy your cake form to the cloud without running anything locally!

## Option 1: Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 3: Set Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SHEETS_RANGE=Orders!A:J
```

## Option 2: Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Deploy
```bash
# Build and deploy
netlify deploy --prod --dir .
```

### Step 3: Set Environment Variables
In Netlify dashboard:
1. Go to Site settings
2. Navigate to "Environment variables"
3. Add the same variables as above

## Option 3: GitHub Pages + Formspree

### Step 1: Use Formspree for Form Handling
1. Go to [Formspree.io](https://formspree.io)
2. Create a new form
3. Get your form endpoint URL

### Step 2: Update Form Action
Replace the form submission in `index.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Step 3: Deploy to GitHub Pages
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Your form will be live at `https://yourusername.github.io/cake-form`

## Email Service Setup

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an "App Password"
3. Use your Gmail address and app password

### Alternative: SendGrid
1. Sign up at [SendGrid.com](https://sendgrid.com)
2. Get API key
3. Update environment variables:
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## Google Sheets Setup

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Add headers: Order ID, Order Date, Customer Name, Email, Phone, Pickup Date, Total Amount, Status, Special Instructions, Products

### Step 2: Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google Sheets API
4. Create service account
5. Download JSON credentials

### Step 3: Share Sheet
1. Open your Google Sheet
2. Click "Share"
3. Add service account email as editor
4. Copy the service account JSON to environment variables

## Testing Your Deployment

### Test Form Submission
1. Fill out the form on your live site
2. Check your email for confirmation
3. Verify order appears in Google Sheets

### Test Email Delivery
- Check spam folders
- Verify email templates render correctly
- Test both customer and business emails

## Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check browser console for errors
   - Verify API endpoint is correct
   - Check CORS settings

2. **Emails not sending**
   - Verify environment variables
   - Check Gmail app password
   - Test with different email service

3. **Google Sheets not updating**
   - Verify service account permissions
   - Check sheet sharing settings
   - Verify credentials JSON format

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Formspree Documentation](https://formspree.io/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

## Cost Considerations

### Vercel
- Free tier: 100GB bandwidth, 100GB-hours serverless function execution
- Pro: $20/month for unlimited

### Netlify
- Free tier: 100GB bandwidth, 300 build minutes
- Pro: $19/month for unlimited

### Formspree
- Free tier: 50 submissions/month
- Pro: $10/month for 1,000 submissions

### Google Sheets
- Free for personal use
- No additional cost for API calls

## Security Notes

- Never commit environment variables to Git
- Use app passwords, not main passwords
- Regularly rotate API keys
- Monitor usage and costs
- Use HTTPS for all deployments

Your form will be live and accessible from anywhere without running anything on your local computer!
