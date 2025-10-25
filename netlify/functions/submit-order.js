const nodemailer = require('nodemailer');
const AirtableIntegration = require('../../airtable-integration');

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

// Airtable integration
const airtable = new AirtableIntegration();

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

                ${formData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${formData.specialInstructions}</p>` : ''}

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
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #8B4A9C; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">New Order Received</h1>
                <p style="color: white; margin: 10px 0 0 0;">Order ID: ${orderId}</p>
            </div>

            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #8B4A9C; margin-bottom: 20px;">Order Details</h2>

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

                ${formData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${formData.specialInstructions}</p>` : ''}

                <div style="background: #8B4A9C; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin: 0; color: white;">Estimated Total: $${total.toFixed(2)}</h3>
                </div>

                <p style="color: #666; font-size: 14px;">
                    <strong>Action Required:</strong><br>
                    • Create sketch of the order<br>
                    • Send confirmation email to customer<br>
                    • Update Airtable with order details
                </p>
            </div>
        </div>
    `;
}

// Add order to Airtable
async function addOrderToAirtable(formData) {
    try {
        const result = await airtable.addOrderToAirtable(formData);
        console.log('Order added to Airtable successfully');
        return result;
    } catch (error) {
        console.error('Error adding order to Airtable:', error);
        // Don't throw error - continue with email sending even if Airtable fails
        return { success: false, orderId: 'ERROR', total: 0 };
    }
}

// Main handler function
exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const formData = JSON.parse(event.body);

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

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                orderId: orderId,
                message: 'Order submitted successfully! Check your email for confirmation.'
            })
        };

    } catch (error) {
        console.error('Error processing order:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Error processing order. Please try again or contact us directly.'
            })
        };
    }
};
