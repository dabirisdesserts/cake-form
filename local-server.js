const express = require('express');
const cors = require('cors');
const AirtableIntegration = require('./airtable-integration');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Airtable integration
const airtable = new AirtableIntegration();

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Submit order endpoint
app.post('/api/submit-order', async (req, res) => {
    try {
        const formData = req.body;

        // Add to Airtable first to get order ID and total
        const airtableResult = await airtable.addOrderToAirtable(formData);

        if (airtableResult.success) {
            res.json({
                success: true,
                orderId: airtableResult.orderId,
                total: airtableResult.total,
                message: 'Order submitted successfully! Check your Airtable base for the new order.'
            });
        } else {
            throw new Error('Failed to add order to Airtable');
        }

    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing order. Please try again or contact us directly.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
    console.log(`Form: http://localhost:${PORT}`);
    console.log(`Test: http://localhost:${PORT}/test-deployment.html`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
});
