# Vercel Deployment Guide for Dabiri's Desserts Cake Form

This guide will help you deploy your cake order form to Vercel as an alternative to Netlify.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: You'll need the same environment variables from your Netlify setup

## Quick Deployment (Recommended)

### Method 1: Deploy from GitHub (Easiest)

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty

3. **Set Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add the following variables (same as your Netlify setup):
     ```
     EMAIL_USER=your-gmail@gmail.com
     EMAIL_PASS=your-app-password
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     BUSINESS_EMAIL=your-business-email@gmail.com
     AIRTABLE_API_KEY=your-airtable-api-key
     AIRTABLE_BASE_ID=your-airtable-base-id
     AIRTABLE_TABLE_ID=your-airtable-table-id
     ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your site
   - You'll get a URL like `https://your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   vercel env add EMAIL_HOST
   vercel env add EMAIL_PORT
   vercel env add BUSINESS_EMAIL
   vercel env add AIRTABLE_API_KEY
   vercel env add AIRTABLE_BASE_ID
   vercel env add AIRTABLE_TABLE_ID
   ```

## Project Structure

Your project is now configured for Vercel with this structure:

```
cake-form/
├── api/
│   └── submit-order.js          # Vercel API route
├── netlify/                     # Old Netlify functions (can be removed)
├── index.html                   # Main form page
├── vercel.json                  # Vercel configuration
├── package.json                 # Updated for Vercel
└── env.example                  # Environment variables template
```

## Key Changes Made

1. **API Routes**: Moved from `/.netlify/functions/` to `/api/`
2. **Configuration**: Created `vercel.json` for Vercel-specific settings
3. **Package.json**: Updated scripts and dependencies for Vercel
4. **CORS**: Updated CORS handling for Vercel's API routes

## Environment Variables

Make sure to set these in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Your Gmail address | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `your-16-char-password` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `BUSINESS_EMAIL` | Business email for notifications | `business@email.com` |
| `AIRTABLE_API_KEY` | Airtable API key | `keyXXXXXXXXXXXXXX` |
| `AIRTABLE_BASE_ID` | Airtable base ID | `appXXXXXXXXXXXXXX` |
| `AIRTABLE_TABLE_ID` | Airtable table ID | `tblXXXXXXXXXXXXXX` |

## Testing Your Deployment

1. **Visit your Vercel URL**: `https://your-project-name.vercel.app`
2. **Fill out the form** with test data
3. **Submit the form** and check:
   - You receive a confirmation email
   - The business email receives a notification
   - The order appears in your Airtable

## Vercel vs Netlify Comparison

| Feature | Netlify | Vercel |
|---------|---------|--------|
| **Free Tier** | 100GB bandwidth, 300 build minutes | 100GB bandwidth, 100GB-hours serverless |
| **Functions** | Netlify Functions | Vercel Functions |
| **Deployment** | Git-based or CLI | Git-based or CLI |
| **Environment Variables** | Project settings | Project settings |
| **Custom Domains** | Yes (free) | Yes (free) |
| **HTTPS** | Automatic | Automatic |

## Troubleshooting

### Common Issues

1. **Function Timeout**: Vercel has a 10-second timeout for hobby plans
2. **Environment Variables**: Make sure all are set correctly
3. **CORS Issues**: The API route includes proper CORS headers
4. **Email Issues**: Verify Gmail App Password is correct

### Debugging

1. **Check Vercel Function Logs**:
   - Go to your project dashboard
   - Click on "Functions" tab
   - View logs for any errors

2. **Test API Endpoint**:
   ```bash
   curl -X POST https://your-project.vercel.app/api/submit-order \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

## Migration from Netlify

If you're migrating from Netlify:

1. **Keep both deployments** initially for testing
2. **Update your domain** to point to Vercel when ready
3. **Remove Netlify deployment** after confirming Vercel works
4. **Update any hardcoded URLs** in your code

## Cost Comparison

### Vercel Free Tier
- **Bandwidth**: 100GB/month
- **Function executions**: 100GB-hours/month
- **Build minutes**: 6,000/month
- **Custom domains**: Unlimited

### Netlify Free Tier
- **Bandwidth**: 100GB/month
- **Build minutes**: 300/month
- **Function invocations**: 125,000/month
- **Custom domains**: Unlimited

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Function Logs**: Available in your Vercel dashboard

## Next Steps

1. Deploy to Vercel using one of the methods above
2. Test the form thoroughly
3. Update your domain DNS to point to Vercel
4. Monitor the function logs for any issues
5. Consider setting up monitoring/alerting for form submissions

Your cake form should now work exactly the same on Vercel as it did on Netlify!
