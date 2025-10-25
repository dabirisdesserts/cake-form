# 📊 Airtable Setup for Dabiri's Desserts

## Step 1: Create Your Airtable Base

1. **Go to [airtable.com](https://airtable.com)** and sign in
2. **Create a new base** called "Dabiri's Desserts Orders"
3. **Set up your table** with these fields:

### Required Fields:
- **Order ID** (Single line text)
- **Customer Name** (Single line text)
- **Email** (Email)
- **Phone** (Phone number)
- **Pickup Date** (Date)
- **Order Details** (Long text)
- **Special Instructions** (Long text)
- **Total Price** (Currency)
- **Status** (Single select: Pending, Confirmed, In Progress, Completed, Cancelled)
- **Order Date** (Date)

## Step 2: Get Your Base ID

1. **Open your base** in Airtable
2. **Look at the URL**: `https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY/viwZZZZZZZZZZZZZZ`
3. **Copy the Base ID**: The part after `/app` and before `/tbl` (e.g., `appXXXXXXXXXXXXXX`)

## Step 3: Get Your Table ID

1. **In your base**, click on the table name
2. **Look at the URL**: The part after `/tbl` (e.g., `tblYYYYYYYYYYYYYY`)

## Step 4: Update Environment Variables

Add these to your `.env` file:

```env
# Airtable Configuration
AIRTABLE_API_KEY=your-airtable-api-key-here
AIRTABLE_BASE_ID=your-base-id-here
AIRTABLE_TABLE_ID=your-table-id-here
```

## Step 5: Test Airtable Integration

Run the test script:
```bash
npm run test:airtable
```

## Step 6: Deploy with Airtable

1. **Set environment variables** in your deployment platform
2. **Deploy your form**
3. **Test with real form submissions**

## Benefits of Airtable:

✅ **Completely Free** - No payment required
✅ **Beautiful Interface** - Easy to view and manage orders
✅ **Mobile App** - Check orders on your phone
✅ **Export to CSV** - Download data anytime
✅ **API Access** - Automatic integration with your form
✅ **Status Tracking** - Update order status easily
✅ **Search & Filter** - Find orders quickly

## Troubleshooting:

### Common Issues:
1. **"Invalid API key"** - Check your personal access token
2. **"Base not found"** - Verify your Base ID is correct
3. **"Table not found"** - Check your Table ID

### Support:
- **Airtable API Docs**: https://airtable.com/developers/web/api/introduction
- **Personal Access Tokens**: https://airtable.com/developers/web/guides/personal-access-tokens

Your order tracking system will be professional and completely free! 🎂✨
