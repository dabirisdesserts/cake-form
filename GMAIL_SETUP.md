# 📧 Gmail Setup for dabirisdesserts@gmail.com

## Step 1: Enable 2-Factor Authentication

1. **Go to your Google Account**: https://myaccount.google.com
2. **Sign in** with `dabirisdesserts@gmail.com`
3. **Navigate to Security** → **2-Step Verification**
4. **Enable 2-Step Verification** if not already enabled
5. **Follow the setup process** (phone number, backup codes, etc.)

## Step 2: Generate App Password

1. **Go to Google Account Security**: https://myaccount.google.com/security
2. **Find "2-Step Verification"** section
3. **Click "App passwords"** (you may need to sign in again)
4. **Select "Mail"** as the app type
5. **Select "Other (custom name)"** and type: "Cake Form Orders"
6. **Click "Generate"**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

## Step 3: Update Environment Variables

Update your `.env` file with the following:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=dabirisdesserts@gmail.com
EMAIL_PASS=your-16-character-app-password-here
BUSINESS_EMAIL=dabirisdesserts@gmail.com

# Google Sheets Configuration
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials.json
GOOGLE_SHEETS_ID=your-google-sheet-id
GOOGLE_SHEETS_RANGE=Orders!A:J

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Step 4: Test Email Configuration

Run this test to verify your email setup:

```bash
node test-email.js
```

## Step 5: Email Templates Preview

Your customers will receive emails from `dabirisdesserts@gmail.com` with:

### Customer Email Features:
- ✅ Professional branding with your logo
- ✅ Order confirmation with unique order ID
- ✅ Complete order details and pricing
- ✅ Next steps and timeline
- ✅ Contact information

### Business Email Features:
- ✅ New order notifications
- ✅ Complete customer information
- ✅ Order details and special requests
- ✅ Pricing breakdown
- ✅ Action items for fulfillment

## Step 6: Google Sheets Integration

1. **Create a Google Sheet** named "Dabiri's Desserts Orders"
2. **Add these column headers** in row 1:
   - Order ID
   - Order Date
   - Customer Name
   - Email
   - Phone
   - Pickup Date
   - Total Amount
   - Status
   - Special Instructions
   - Products

3. **Set up Google Sheets API** (see GOOGLE_SHEETS_SETUP.md)

## Step 7: Deploy with Email Configuration

### For Vercel Deployment:
1. **Set environment variables** in Vercel dashboard
2. **Add all the variables** from your `.env` file
3. **Deploy**: `vercel --prod`

### For Netlify Deployment:
1. **Set environment variables** in Netlify dashboard
2. **Deploy**: `netlify deploy --prod`

## Step 8: Test Complete Workflow

1. **Submit a test order** through your form
2. **Check your email** (dabirisdesserts@gmail.com) for business notification
3. **Check customer email** for confirmation
4. **Verify Google Sheets** has the new order
5. **Test CSV export** functionality

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**:
   - Make sure you're using the App Password, not your regular password
   - Verify 2-factor authentication is enabled
   - Check that the App Password is correct (16 characters, no spaces)

2. **"Less secure app access" error**:
   - Use App Passwords instead of regular passwords
   - Don't enable "Less secure app access" (it's deprecated)

3. **Emails going to spam**:
   - Add your domain to SPF records (if using custom domain)
   - Use professional email templates
   - Avoid spam trigger words

### Security Best Practices:

- ✅ **Never commit** your `.env` file to Git
- ✅ **Use App Passwords** instead of regular passwords
- ✅ **Rotate App Passwords** regularly
- ✅ **Monitor email usage** in Google Account
- ✅ **Use HTTPS** for all deployments

## Support

If you encounter issues:
1. **Check Google Account Security** settings
2. **Verify App Password** is correct
3. **Test with a simple email** first
4. **Check server logs** for detailed error messages

Your email setup will be professional and secure! 🎂✨
