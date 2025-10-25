#!/usr/bin/env node

/**
 * Email Setup Script for dabirisdesserts@gmail.com
 * Run with: node setup-email.js
 */

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupEmail() {
    console.log('📧 Gmail Setup for dabirisdesserts@gmail.com');
    console.log('=============================================\n');

    console.log('This script will help you configure your email settings.\n');

    console.log('📋 BEFORE YOU START:');
    console.log('====================');
    console.log('1. Go to https://myaccount.google.com');
    console.log('2. Sign in with dabirisdesserts@gmail.com');
    console.log('3. Enable 2-Factor Authentication');
    console.log('4. Generate an App Password for "Mail"\n');

    const appPassword = await question('Enter your 16-character App Password: ');

    if (appPassword.length !== 16) {
        console.log('❌ App Password should be 16 characters long');
        rl.close();
        return;
    }

    // Create .env file
    const envContent = `# Email Configuration for dabirisdesserts@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=dabirisdesserts@gmail.com
EMAIL_PASS=${appPassword}
BUSINESS_EMAIL=dabirisdesserts@gmail.com

# Google Sheets Configuration (optional)
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials.json
GOOGLE_SHEETS_ID=your-google-sheet-id
GOOGLE_SHEETS_RANGE=Orders!A:J

# Server Configuration
PORT=3000
NODE_ENV=development
`;

    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Created .env file with your email configuration');

    console.log('\n🧪 Testing Email Configuration...');
    console.log('===================================');

    // Test the configuration
    try {
        const { spawn } = require('child_process');
        const testProcess = spawn('node', ['test-email.js'], { stdio: 'inherit' });

        testProcess.on('close', (code) => {
            if (code === 0) {
                console.log('\n🎉 Email setup complete!');
                console.log('\n📝 Next Steps:');
                console.log('===============');
                console.log('1. Deploy to Vercel: vercel --prod');
                console.log('2. Set environment variables in Vercel dashboard');
                console.log('3. Test with real form submissions');
                console.log('4. Set up Google Sheets integration (optional)');
            } else {
                console.log('\n❌ Email test failed. Please check your configuration.');
                console.log('\n🔧 Troubleshooting:');
                console.log('===================');
                console.log('• Verify your App Password is correct');
                console.log('• Check that 2-Factor Authentication is enabled');
                console.log('• Ensure you\'re using the App Password, not your regular password');
            }
        });
    } catch (error) {
        console.log('❌ Error running email test:', error.message);
    }

    rl.close();
}

setupEmail().catch(console.error);
