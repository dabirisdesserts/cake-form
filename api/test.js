// Simple test endpoint for Vercel deployment
export default function handler(req, res) {
    res.status(200).json({
        success: true,
        message: 'Vercel deployment is working!',
        timestamp: new Date().toISOString()
    });
}
