#!/usr/bin/env node

/**
 * Airtable Setup Script for Dabiri's Desserts
 * Run with: node setup-airtable.js
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

async function setupAirtable() {
    console.log('📊 Airtable Setup for Dabiri\'s Desserts');
    console.log('========================================\n');

    console.log('This script will help you configure Airtable integration.\n');

    console.log('📋 BEFORE YOU START:');
    console.log('====================');
    console.log('1. Go to https://airtable.com and create a new base');
    console.log('2. Name it "Dabiri\'s Desserts Orders"');
    console.log('3. Add the required fields (see AIRTABLE_SETUP.md)');
    console.log('4. Get your Base ID and Table ID from the URL\n');

    const apiKey = await question('Enter your Airtable API Key (pat...): ');
    const baseId = await question('Enter your Airtable Base ID (app...): ');
    const tableId = await question('Enter your Airtable Table ID (tbl...): ');

    if (!apiKey.startsWith('pat') || !baseId.startsWith('app') || !tableId.startsWith('tbl')) {
        console.log('❌ Invalid format. Please check your IDs and try again.');
        rl.close();
        return;
    }

    // Read existing .env file or create new one
    let envContent = '';
    if (fs.existsSync('.env')) {
        envContent = fs.readFileSync('.env', 'utf8');
    }

    // Update or add Airtable configuration
    const airtableConfig = `# Airtable Configuration
AIRTABLE_API_KEY=${apiKey}
AIRTABLE_BASE_ID=${baseId}
AIRTABLE_TABLE_ID=${tableId}
`;

    // Remove existing Airtable config if present
    envContent = envContent.replace(/# Airtable Configuration[\s\S]*?AIRTABLE_TABLE_ID=.*\n/g, '');

    // Add new Airtable config
    envContent += '\n' + airtableConfig;

    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Updated .env file with Airtable configuration');

    console.log('\n🧪 Testing Airtable Integration...');
    console.log('===================================');

    // Test the configuration
    try {
        const { spawn } = require('child_process');
        const testProcess = spawn('node', ['test-airtable.js'], { stdio: 'inherit' });

        testProcess.on('close', (code) => {
            if (code === 0) {
                console.log('\n🎉 Airtable setup complete!');
                console.log('\n📝 Next Steps:');
                console.log('===============');
                console.log('1. Deploy to Vercel: vercel --prod');
                console.log('2. Set environment variables in Vercel dashboard');
                console.log('3. Test with real form submissions');
                console.log('4. Check your Airtable base for new orders');
                console.log('\n🎯 Benefits:');
                console.log('=============');
                console.log('• Completely free database');
                console.log('• Beautiful interface for managing orders');
                console.log('• Mobile app for checking orders on the go');
                console.log('• Export to CSV anytime');
                console.log('• No Google Cloud costs!');
            } else {
                console.log('\n❌ Airtable test failed. Please check your configuration.');
                console.log('\n🔧 Troubleshooting:');
                console.log('===================');
                console.log('• Verify your API key is correct');
                console.log('• Check that your Base ID and Table ID are correct');
                console.log('• Ensure your Airtable base has the required fields');
                console.log('• Make sure your base is accessible');
            }
        });
    } catch (error) {
        console.log('❌ Error running Airtable test:', error.message);
    }

    rl.close();
}

setupAirtable().catch(console.error);
