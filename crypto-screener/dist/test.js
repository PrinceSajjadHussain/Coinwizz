const { chromium } = require('playwright');
const path = require('path');

async function testCryptoScreener() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const errors = [];
    const warnings = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        } else if (msg.type() === 'warning') {
            warnings.push(msg.text());
        }
    });
    
    page.on('pageerror', err => {
        errors.push(err.message);
    });
    
    const filePath = 'file://' + path.resolve(__dirname, 'index.html');
    console.log('Opening:', filePath);
    
    try {
        await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
        console.log('Page loaded successfully');
        
        // Wait for data to load
        await page.waitForTimeout(10000);
        
        // Check key elements
        const canvas = await page.$('#cryptoCanvas');
        const btnLogin = await page.$('#btnLogin');
        const btnTagesgewinner = await page.$('#btnTagesgewinner');
        const loginModal = await page.$('#loginModal');
        const splitPanels = await page.$('#splitPanels');
        
        if (canvas) console.log('✓ Main canvas found');
        if (btnLogin) console.log('✓ Login button found');
        if (btnTagesgewinner) console.log('✓ Tagesgewinner button found');
        if (loginModal) console.log('✓ Login modal found');
        if (splitPanels) console.log('✓ Split panels found');
        
        // Test login modal
        await btnLogin.click();
        await page.waitForTimeout(500);
        const modalVisible = await page.$eval('#loginModal', el => el.classList.contains('visible'));
        if (modalVisible) console.log('✓ Login modal opens correctly');
        
        // Close modal
        await page.click('#closeModal');
        await page.waitForTimeout(300);
        
        // Test Tagesgewinner button
        await btnTagesgewinner.click();
        await page.waitForTimeout(500);
        const splitVisible = await page.$eval('#splitPanels', el => el.classList.contains('visible'));
        if (splitVisible) console.log('✓ Split view opens correctly');
        
        // Check for winners canvas
        const winnersCanvas = await page.$('#winnersCanvas');
        const losersCanvas = await page.$('#losersCanvas');
        if (winnersCanvas) console.log('✓ Winners canvas found');
        if (losersCanvas) console.log('✓ Losers canvas found');
        
        // Close split view
        await page.click('#closePanels');
        await page.waitForTimeout(300);
        
    } catch (err) {
        errors.push('Test error: ' + err.message);
    }
    
    await browser.close();
    
    console.log('\n=== Test Results ===');
    if (errors.length > 0) {
        console.log('ERRORS:');
        errors.forEach(e => console.log('  - ' + e));
    } else {
        console.log('✓ No errors found!');
    }
    
    if (warnings.length > 0) {
        console.log('WARNINGS:');
        warnings.forEach(w => console.log('  - ' + w));
    }
    
    process.exit(errors.length > 0 ? 1 : 0);
}

testCryptoScreener();
