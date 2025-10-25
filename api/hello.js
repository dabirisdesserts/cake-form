// Simple test function for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello from Vercel!',
    timestamp: new Date().toISOString()
  });
};
