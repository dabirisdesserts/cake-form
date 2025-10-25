const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set content type to HTML
  res.setHeader('Content-Type', 'text/html');
  
  // Read and serve the index.html file
  const htmlPath = path.join(__dirname, 'index.html');
  
  try {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error reading index.html:', error);
    res.status(500).send('Error loading page');
  }
};