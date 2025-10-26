/**
 * Airtable Integration for Dabiri's Desserts
 * Replaces Google Sheets with free Airtable database
 */

const https = require('https');

class AirtableIntegration {
    constructor() {
        this.apiKey = process.env.AIRTABLE_API_KEY;
        this.baseId = process.env.AIRTABLE_BASE_ID;
        this.tableId = process.env.AIRTABLE_TABLE_ID;
        this.baseUrl = `https://api.airtable.com/v0/${this.baseId}/${this.tableId}`;
    }

    // Generate order ID
    generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `DD-${timestamp}-${random}`.toUpperCase();
    }

    // Calculate total price
    calculateTotal(formData) {
        let total = 0;

        // Add product prices
        if (formData.products) {
            formData.products.forEach(product => {
                if (product.quantity > 0) {
                    total += product.price * product.quantity;
                }
            });
        }

        // Add rush fee if applicable
        const pickupDate = new Date(formData.pickupDate);
        const today = new Date();
        const daysDifference = Math.ceil((pickupDate - today) / (1000 * 60 * 60 * 24));

        if (daysDifference < 10) {
            total += 20; // Rush fee
        }

        return total;
    }

    // Add order to Airtable
    async addOrderToAirtable(formData) {
        return new Promise((resolve, reject) => {
            const orderId = this.generateOrderId();
            const total = this.calculateTotal(formData);

            const orderData = {
                fields: {
                    "Order ID": orderId,
                    "Customer Name": `${formData.firstName} ${formData.lastName}`,
                    "Email": formData.email,
                    "Phone Number": formData.phone,
                    "Pickup Date": formData.pickupDate,
                    "Order Details": JSON.stringify(formData.products || []),
                    "Special Instructions": formData.customItems || '',
                    "Design Requests": formData.designRequests || '',
                    "Cake Text": formData.cakeText || '',
                    "Color Requests": formData.colorRequests || '',
                    "Custom Flavor": formData.customFlavor || '',
                    "Additional Specs": formData.additionalSpecs || '',
                    "Allergies": formData.allergies || '',
                    "How Did You Hear": formData.howDidYouHear || '',
                    "Total Price": total,
                    "Order Status": "Submitted",
                    "Order Date": new Date().toISOString().split('T')[0]
                }
            };

            const postData = JSON.stringify(orderData);

        const options = {
            hostname: 'api.airtable.com',
            port: 443,
            path: `/v0/${this.baseId}/${this.tableId}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('Order added to Airtable successfully');
                        resolve({ success: true, orderId, total });
                    } else {
                        console.error('Error adding order to Airtable:', data);
                        reject(new Error(`Airtable API error: ${res.statusCode} - ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Request error:', error);
                reject(error);
            });

            req.write(postData);
            req.end();
        });
    }

    // Test Airtable connection
    async testConnection() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.airtable.com',
                port: 443,
                path: `/v0/${this.baseId}/${this.tableId}?maxRecords=1`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('Airtable connection successful');
                        resolve(true);
                    } else {
                        console.error('Airtable connection failed:', data);
                        reject(new Error(`Airtable API error: ${res.statusCode} - ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Request error:', error);
                reject(error);
            });

            req.end();
        });
    }

    // Get orders from Airtable
    async getOrders() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.airtable.com',
                port: 443,
                path: `/v0/${this.baseId}/${this.tableId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const response = JSON.parse(data);
                        resolve(response.records);
                    } else {
                        console.error('Error fetching orders:', data);
                        reject(new Error(`Airtable API error: ${res.statusCode} - ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Request error:', error);
                reject(error);
            });

            req.end();
        });
    }
}

module.exports = AirtableIntegration;
