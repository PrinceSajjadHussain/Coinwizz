# PayPal Sandbox Integration Guide - CryptoSpaces

## Overview
Your dashboard is now integrated with PayPal Sandbox for subscription management. This guide provides all setup information and instructions.

---

## 📋 PayPal Sandbox Credentials

### Account Login
- **Email**: `sb-lq6hp48254000@business.example.com`
- **Password**: `IF6r%{3:`
- **Sandbox URL**: https://sandbox.paypal.com

### API Credentials (NVP/SOAP)
- **Username**: `sb-lq6hp48254000_api1.business.example.com`
- **Password**: `BY3EAJDRZX66VVW6`
- **Signature**: `AI1jgYOHg.2A6JcdeicuHRlcPgdYAwhMGv3Zv-w6pAfKLXK8YpcbgJMz`

### REST API Credentials (APP)
- **Client ID**: `AWTLzIn6rdXSl9AnXS4JH_WYN5pu5oeab0035Cx23H0chTupESGKMxRxFZkRq2mASSUPNch6pOwG_ig`
- **Secret Key**: `EOvz9Lfuy7LBFk4pg9NFty4MTrZDsXdBZuE1-rEKrtKAwxPKjx9G1Q0-xpO78Ffzt2rIVMEKuP6iqgzW`

---

## 🎯 Subscription Plans

| Plan | Price | Duration | Features |
|------|-------|----------|----------|
| **Rallye 25** | €24.90 | Monthly | 25 coins, watch coins, save favorites, settings |
| **Rallye 50** | €49.90 | Monthly | 50 coins + all features |
| **ELITE - Rallye 100** | €99.90 | Monthly | 100 coins + premium features |

---

## 🔧 Implementation Details

### 1. Frontend Integration (dashboard.html)
- PayPal SDK loaded with Client ID
- Three PayPal subscription buttons (one per plan)
- Automatic plan upgrade on successful payment
- User session update on approval

**Locations**:
- PayPal SDK: Line 7 in `<head>`
- Payment buttons: Lines 266-280 in upgrade section
- Initialization script: Lines 525-570

### 2. Backend Configuration
- **File**: `paypal-config.json`
- Contains all credentials and plan definitions
- Subscription plan details with pricing
- Payment preferences (auto-billing, retry settings)

### 3. Webhook Handler
- **File**: `paypal-webhook-handler.js`
- Handles subscription lifecycle events
- Processes payment notifications
- Updates user account status

**Supported Events**:
- `BILLING.SUBSCRIPTION.CREATED` - New subscription
- `BILLING.SUBSCRIPTION.ACTIVATED` - Subscription active
- `BILLING.SUBSCRIPTION.UPDATED` - Subscription changes
- `BILLING.SUBSCRIPTION.CANCELLED` - Cancellation
- `PAYMENT.CAPTURE.COMPLETED` - Payment received
- `PAYMENT.CAPTURE.REFUNDED` - Refund processed

---

## 🚀 Setup Steps

### Step 1: Verify PayPal Credentials
1. Go to: https://sandbox.paypal.com
2. Login with provided credentials
3. Verify API signature in Account Settings → API Signature

### Step 2: Configure Webhook Endpoint
1. In PayPal Dashboard, go to: Settings → Notifications → Webhook Endpoints
2. Add your webhook URL:
   ```
   https://your-domain.com/api/paypal-webhook
   ```
3. Subscribe to these events:
   - Billing subscription created
   - Billing subscription updated
   - Billing subscription activated
   - Billing subscription cancelled
   - Payment captured
   - Payment refunded

### Step 3: Create Subscription Plans (if not auto-created)
Use PayPal's Billing Plans API to create plans:
```bash
curl -X POST https://api.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ACCESS_TOKEN]" \
  -d @paypal-config.json
```

### Step 4: Test on Dashboard
1. Log in to dashboard: http://localhost:8000/crypto-screener/dist/dashboard.html
2. Click on one of the subscription buttons
3. Complete test payment (use sandbox test cards)

---

## 💳 Test Payment Methods

### Test Credit Cards (Sandbox Only)
| Card Type | Number | Expires | CVV |
|-----------|--------|---------|-----|
| Visa | 4532015112830366 | 12/2025 | 123 |
| Mastercard | 5425233010103442 | 12/2025 | 123 |
| American Express | 371449635398431 | 12/2025 | 1234 |

**Test Payer Email**: 
- `sb-lq6hp48254000@business.example.com`

---

## 📊 How It Works

### User Journey
1. **User Logs In** → Dashboard loads with free plan
2. **Selects Plan** → Clicks PayPal button (25/50/100)
3. **Approves Payment** → PayPal Sandbox window opens
4. **Completes Transaction** → Returns to dashboard
5. **Plan Activated** → User localStorage updated with new plan
6. **Features Unlocked** → Dashboard displays premium features

### Backend Flow
1. **Webhook Received** → PayPal sends event notification
2. **Verified** → Signature validation
3. **Processed** → Event-specific handler runs
4. **Database Updated** → User record updated with subscription status
5. **Logged** → Event logged for audit trail

---

## 🔐 Security Notes

### For Production
1. **Never commit credentials** to public repos
2. Use environment variables:
   ```bash
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_SECRET=your_secret
   PAYPAL_MODE=live
   ```

3. Implement proper webhook signature verification
4. Use HTTPS for all endpoints
5. Store webhook data in secure database
6. Implement subscription status caching

### Current Configuration
- ✅ Sandbox mode active (no real payments)
- ⚠️ Credentials stored in JSON files (dev only)
- ⚠️ Simplified webhook validation (dev only)

---

## 🐛 Troubleshooting

### PayPal Buttons Not Showing
```javascript
// Check if user is logged in
if (user && user.loggedIn) {
  console.log('User authenticated');
} else {
  console.log('Login required to see buttons');
}

// Verify PayPal SDK loaded
if (window.paypal) {
  console.log('PayPal SDK ready');
} else {
  console.log('PayPal SDK not loaded');
}
```

### Webhook Not Triggering
1. Verify webhook URL is publicly accessible
2. Check PayPal webhook settings in sandbox account
3. Monitor PayPal event logs for delivery failures
4. Test with PayPal's webhook simulator tool

### Payment Not Updating Plan
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check webhook handler logs
4. Ensure database is updated (if using backend)

---

## 📞 Support Resources

- **PayPal Sandbox**: https://sandbox.paypal.com
- **PayPal Developer**: https://developer.paypal.com
- **API Documentation**: https://developer.paypal.com/api/rest/
- **Webhook Events**: https://developer.paypal.com/docs/api-basics/webhooks/event-names/

---

## 📝 File Locations

```
crypto-screener/
├── dist/
│   └── dashboard.html          # Frontend with PayPal buttons
├── paypal-config.json          # Configuration & credentials
└── paypal-webhook-handler.js   # Backend webhook processor
```

---

## ✅ Checklist

- [ ] PayPal credentials verified in sandbox
- [ ] Dashboard loads with PayPal buttons
- [ ] Test payment processed successfully
- [ ] Plan upgraded in user session
- [ ] Webhook endpoint configured in PayPal
- [ ] Backend webhook handler deployed
- [ ] Environment variables configured (production)
- [ ] HTTPS enabled for payment flow
- [ ] Error handling tested
- [ ] Subscription cancellation works

---

**Last Updated**: January 11, 2026
**Status**: ✅ Sandbox Integration Complete
**Mode**: Sandbox (No Real Payments)
