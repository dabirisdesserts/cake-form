const nodemailer = require('nodemailer');
const https = require('https');

// Email configuration using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `DD-${timestamp}-${random}`.toUpperCase();
}

// Calculate total price
function calculateTotal(formData) {
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

// Test Airtable connection first
function testAirtableConnection() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.airtable.com',
            port: 443,
            path: `/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?maxRecords=1`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log('Airtable test response:', res.statusCode, data);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, data: JSON.parse(data) });
                } else {
                    reject(new Error(`Airtable test failed: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Add order to Airtable
function addOrderToAirtable(formData) {
    return new Promise((resolve, reject) => {
        const orderId = generateOrderId();
        const total = calculateTotal(formData);

        const orderData = {
            fields: {
                "Order ID": orderId,
                "Customer Name": `${formData.firstName} ${formData.lastName}`,
                "Email": formData.email,
                "Phone Number": formData.phone,
                "Pickup Date": formData.pickupDate,
                "Order Details": JSON.stringify(formData.products || []),
                "Special Instructions": formData.customItems || '',
                "Total Price": total,
                "Order Status": "Submitted",
                "Order Date": new Date().toISOString().split('T')[0]
            }
        };

        const postData = JSON.stringify(orderData);

        const options = {
            hostname: 'api.airtable.com',
            port: 443,
            path: `/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
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

// Create customer email template
function createCustomerEmailTemplate(formData, orderId, total) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #E8C7FF 0%, #D9B3FF 50%, #C297FF 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Dabiri's Desserts</h1>
                <p style="color: white; margin: 10px 0 0 0;">Order Confirmation</p>
            </div>

            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #8B4A9C; margin-bottom: 20px;">Thank you for your order!</h2>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <strong>Order ID:</strong> ${orderId}<br>
                    <strong>Order Date:</strong> ${new Date().toLocaleDateString()}<br>
                    <strong>Pickup Date:</strong> ${new Date(formData.pickupDate).toLocaleDateString()}
                </div>

                <h3 style="color: #8B4A9C;">Customer Information</h3>
                <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>

                <h3 style="color: #8B4A9C;">Order Details</h3>
                ${formData.products ? formData.products.map(product =>
                    product.quantity > 0 ? `<p><strong>${product.name}:</strong> ${product.quantity} x $${product.price} = $${(product.quantity * product.price).toFixed(2)}</p>` : ''
                ).join('') : ''}

                ${formData.customItems ? `<p><strong>Special Instructions:</strong> ${formData.customItems}</p>` : ''}

                <div style="background: #8B4A9C; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin: 0; color: white;">Total: $${total.toFixed(2)}</h3>
                </div>

                <p style="color: #666; font-size: 14px;">
                    <strong>Next Steps:</strong><br>
                    • I will email you within 3 business days with a sketch of your order<br>
                    • Final price confirmation will be provided<br>
                    • Payment details will be shared once the design is approved
                </p>

                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    Questions? Reply to this email or call me directly.<br>
                    Thank you for choosing Dabiri's Desserts!
                </p>
            </div>
        </div>
    `;
}

// Create business email template
function createBusinessEmailTemplate(formData, orderId, total) {
    // Calculate rush fee
    const pickupDate = new Date(formData.pickupDate);
    const today = new Date();
    const daysDifference = Math.ceil((pickupDate - today) / (1000 * 60 * 60 * 24));
    const hasRushFee = daysDifference < 10;
    const rushFee = hasRushFee ? 20 : 0;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
            <div style="background: #8B4A9C; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🍰 New Order Received</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order ID: ${orderId}</p>
            </div>

            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

                <!-- Order Summary -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #8B4A9C;">
                    <h2 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 20px;">📋 Order Summary</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                        <div><strong>Order ID:</strong> ${orderId}</div>
                        <div><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</div>
                        <div><strong>Pickup Date:</strong> ${new Date(formData.pickupDate).toLocaleDateString()}</div>
                        <div><strong>Days Until Pickup:</strong> ${daysDifference} days</div>
                    </div>
                </div>

                <!-- Customer Information -->
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">👤 Customer Information</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div><strong>Full Name:</strong> ${formData.firstName} ${formData.lastName}</div>
                        <div><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #8B4A9C;">${formData.email}</a></div>
                        <div><strong>Phone:</strong> <a href="tel:${formData.phone}" style="color: #8B4A9C;">${formData.phone}</a></div>
                        <div><strong>Pickup Date:</strong> ${new Date(formData.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>

                <!-- Order Details -->
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">🛒 Order Details</h3>
                    ${formData.products && formData.products.length > 0 ?
                        formData.products.map(product =>
                            product.quantity > 0 ? `
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px; border-left: 3px solid #8B4A9C;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong style="color: #8B4A9C;">${product.name}</strong><br>
                                            <span style="color: #666; font-size: 14px;">Quantity: ${product.quantity}</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-size: 16px; font-weight: bold; color: #8B4A9C;">$${(product.quantity * product.price).toFixed(2)}</div>
                                            <div style="color: #666; font-size: 12px;">$${product.price} each</div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''
                        ).join('') :
                        '<div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 3px solid #ffc107; color: #856404;"><strong>⚠️ No specific products selected</strong><br>Customer may have custom requirements in special instructions.</div>'
                    }
                </div>

                <!-- Special Instructions -->
                ${formData.customItems ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">📝 Special Instructions</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; font-style: italic; color: #495057;">
                        "${formData.customItems}"
                    </div>
                </div>
                ` : ''}

                <!-- Design Requests -->
                ${formData.designRequests ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">🎨 Design/Aesthetic Requests</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; color: #495057;">
                        ${formData.designRequests}
                    </div>
                </div>
                ` : ''}

                <!-- Cake Text -->
                ${formData.cakeText ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">📝 Cake Text</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; color: #495057;">
                        ${formData.cakeText}
                    </div>
                </div>
                ` : ''}

                <!-- Color Requests -->
                ${formData.colorRequests ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">🎨 Color Requests</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; color: #495057;">
                        ${formData.colorRequests}
                    </div>
                </div>
                ` : ''}

                <!-- Custom Flavor -->
                ${formData.customFlavor ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">🍰 Custom Flavor/Filling</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; color: #495057;">
                        ${formData.customFlavor}
                    </div>
                </div>
                ` : ''}

                <!-- Additional Specifications -->
                ${formData.additionalSpecs ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">⚠️ Additional Specifications</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; color: #495057;">
                        ${formData.additionalSpecs}
                    </div>
                </div>
                ` : ''}

                <!-- Allergies/Dietary Restrictions -->
                ${formData.allergies ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">🚨 Allergies/Dietary Restrictions</h3>
                    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 3px solid #ffc107; color: #856404;">
                        <strong>IMPORTANT:</strong> ${formData.allergies}
                    </div>
                </div>
                ` : ''}

                <!-- How Did You Hear -->
                ${formData.howDidYouHear ? `
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">📢 How Did You Hear About Us</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #8B4A9C; color: #495057;">
                        ${formData.howDidYouHear}
                    </div>
                </div>
                ` : ''}

                <!-- Pricing Breakdown -->
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                    <h3 style="color: #8B4A9C; margin: 0 0 15px 0; font-size: 18px;">💰 Pricing Breakdown</h3>
                    <div style="display: grid; gap: 8px; font-size: 14px;">
                        ${formData.products ? formData.products.map(product =>
                            product.quantity > 0 ? `<div style="display: flex; justify-content: space-between;"><span>${product.name} (${product.quantity} x $${product.price})</span><span>$${(product.quantity * product.price).toFixed(2)}</span></div>` : ''
                        ).join('') : '<div style="color: #666;">No products selected</div>'}
                        ${hasRushFee ? `<div style="display: flex; justify-content: space-between; color: #dc3545;"><span>🚨 Rush Fee (${daysDifference} days notice)</span><span>$${rushFee.toFixed(2)}</span></div>` : ''}
                        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #8B4A9C;">
                            <span>Total:</span><span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <!-- Action Required -->
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
                    <h3 style="color: #1976d2; margin: 0 0 15px 0; font-size: 18px;">✅ Action Required</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #1976d2; font-size: 14px;">
                        <li>Create sketch of the order and send to customer</li>
                        <li>Send confirmation email to customer with final pricing</li>
                        <li>Update Airtable with order details and status</li>
                        <li>Contact customer if clarification is needed</li>
                    </ul>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
                    <p>This order was automatically generated from your website form submission.</p>
                    <p>Order processed at: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}

// Vercel API handler
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ message: 'CORS preflight' });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const formData = req.body;

        // Debug logging
        console.log('Received form data:', JSON.stringify(formData, null, 2));
        console.log('Environment variables check:');
        console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
        console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'SET' : 'NOT SET');
        console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? 'SET' : 'NOT SET');
        console.log('AIRTABLE_TABLE_ID:', process.env.AIRTABLE_TABLE_ID ? 'SET' : 'NOT SET');

        // Test Airtable connection first
        try {
            const testResult = await testAirtableConnection();
            console.log('Airtable connection test successful:', testResult);
        } catch (testError) {
            console.error('Airtable connection test failed:', testError);
            throw new Error(`Airtable connection failed: ${testError.message}`);
        }

        // Add to Airtable first to get order ID and total
        const airtableResult = await addOrderToAirtable(formData);
        const orderId = airtableResult.orderId;
        const total = airtableResult.total;

        // Send emails
        const customerEmail = {
            from: process.env.EMAIL_USER,
            to: formData.email,
            subject: `Order Confirmation - ${orderId} - Dabiri's Desserts`,
            html: createCustomerEmailTemplate(formData, orderId, total)
        };

        const businessEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.BUSINESS_EMAIL,
            subject: `New Order Received - ${orderId}`,
            html: createBusinessEmailTemplate(formData, orderId, total)
        };

        // Send emails in parallel
        await Promise.all([
            transporter.sendMail(customerEmail),
            transporter.sendMail(businessEmail)
        ]);

        return res.status(200).json({
            success: true,
            orderId: orderId,
            message: 'Order submitted successfully! Check your email for confirmation.'
        });

    } catch (error) {
        console.error('Error processing order:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Error processing order. Please try again or contact us directly.',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
