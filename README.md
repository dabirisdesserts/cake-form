# Dabiri's Desserts - Order Form System

A complete order management system for custom dessert orders with email notifications and Airtable integration.

## Features

- 🎂 Beautiful order form with product selection
- 📧 Automatic email notifications (customer + business)
- 📊 Airtable integration for order tracking
- 📄 CSV export functionality
- 🎨 Responsive design with dark/light themes
- 💰 Automatic price calculation with rush fees

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Setup Script
```bash
node setup.js
```
This will guide you through configuring email and Google Sheets settings.

### 3. Set Up Google Sheets
Follow the instructions in `GOOGLE_SHEETS_SETUP.md` to:
- Create a Google Sheet
- Set up the Google Sheets API
- Download service account credentials

### 4. Start the Server
```bash
npm start
```

### 5. Test the Form
Open your browser to `http://localhost:3000`

## Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for this application
3. Use your Gmail address and app password in the setup

### Google Sheets Setup
1. Create a new Google Sheet
2. Add headers: Order ID, Order Date, Customer Name, Email, Phone, Pickup Date, Total Amount, Status, Special Instructions, Products
3. Enable Google Sheets API in Google Cloud Console
4. Create a service account and download the JSON key
5. Share your sheet with the service account email

## API Endpoints

- `POST /api/submit-order` - Submit a new order
- `GET /api/export-orders` - Export orders to CSV
- `GET /api/health` - Health check

## File Structure

```
cake-form/
├── index.html          # Frontend form
├── server.js           # Backend server
├── package.json        # Dependencies
├── setup.js           # Setup script
├── .env               # Environment variables
├── credentials.json   # Google Sheets credentials
└── README.md          # This file
```

## Order Flow

1. **Customer submits form** → Data sent to backend
2. **Backend processes order** → Generates unique order ID
3. **Emails sent** → Customer confirmation + business notification
4. **Order added to Google Sheets** → For tracking and management
5. **CSV export available** → For backup and analysis

## Email Templates

### Customer Email
- Order confirmation with order ID
- Order details and pricing
- Next steps and timeline

### Business Email
- New order notification
- Complete order details
- Action items for fulfillment

## Google Sheets Integration

Orders are automatically added to your Google Sheet with:
- Order ID and timestamp
- Customer information
- Order details and pricing
- Status tracking
- Special instructions

## CSV Export

Export all orders to CSV format for:
- Backup purposes
- Data analysis
- Integration with other systems
- Accounting software

## Development

### Start Development Server
```bash
npm run dev
```

### Environment Variables
Create a `.env` file with:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials.json
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SHEETS_RANGE=Orders!A:J
PORT=3000
NODE_ENV=development
```

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail app password
   - Verify SMTP settings
   - Check firewall/antivirus settings

2. **Google Sheets not updating**
   - Verify service account permissions
   - Check sheet sharing settings
   - Ensure credentials.json is correct

3. **Form not submitting**
   - Check browser console for errors
   - Verify server is running
   - Check network connectivity

### Support

For issues or questions:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Test individual components (email, sheets)
4. Check server logs for detailed error messages

## License

MIT License - Feel free to use and modify for your business needs.
