# PayPal Subscription Plans Setup Guide

## Issue: 400 Bad Request Error

The error occurs because the subscription plans (PLAN_25, PLAN_50, PLAN_100) don't exist in your PayPal sandbox account yet.

---

## Solution: Create Subscription Plans in PayPal

### Method 1: Using PayPal Dashboard (Easiest)

1. **Log in to PayPal Sandbox**
   - URL: https://sandbox.paypal.com
   - Email: `sb-lq6hp48254000@business.example.com`
   - Password: `IF6r%{3:`

2. **Navigate to Billing Plans**
   - Click **"Settings"** (gear icon)
   - Select **"Billing Plans"** or **"Subscriptions"**
   - Click **"Create Plan"**

3. **Create Plan 1 - Rallye 25**
   - **Plan Name**: Rallye 25
   - **Description**: 25 coins per month
   - **Billing Frequency**: Monthly
   - **Price**: 24.90 EUR
   - **Billing Cycles**: Do not limit (or set high number)
   - **Plan ID** (if available): `PLAN_25`
   - Click **Save**

4. **Create Plan 2 - Rallye 50**
   - **Plan Name**: Rallye 50
   - **Description**: 50 coins per month
   - **Billing Frequency**: Monthly
   - **Price**: 49.90 EUR
   - **Billing Cycles**: Do not limit
   - **Plan ID**: `PLAN_50`
   - Click **Save**

5. **Create Plan 3 - ELITE PLAN - Rallye 100**
   - **Plan Name**: ELITE PLAN - Rallye 100
   - **Description**: 100 coins per month
   - **Billing Frequency**: Monthly
   - **Price**: 99.90 EUR
   - **Billing Cycles**: Do not limit
   - **Plan ID**: `PLAN_100`
   - Click **Save**

---

### Method 2: Using API (Advanced)

Create plans programmatically using cURL:

```bash
# Set your access token first
ACCESS_TOKEN=$(curl -s -X POST https://api.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "AWTLzIn6rdXSl9AnXS4JH_WYN5pu5oeab0035Cx23H0chTupESGKMxRxFZkRq2mASSUPNch6pOwG_ig:EOvz9Lfuy7LBFk4pg9NFty4MTrZDsXdBZuE1-rEKrtKAwxPKjx9G1Q0-xpO78Ffzt2rIVMEKuP6iqgzW" \
  -d "grant_type=client_credentials" | jq -r '.access_token')

# Create Rallye 25 Plan
curl -X POST https://api.sandbox.paypal.com/v1/billing/plans \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "PROD_CRYPTOSPACES",
    "name": "Rallye 25",
    "description": "25 coins per month",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "24.90",
            "currency_code": "EUR"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_amount": "YES",
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    },
    "taxes": {
      "percentage": "0.00"
    }
  }'
```

---

## Testing Without Pre-Made Plans

The dashboard now supports creating subscriptions without pre-made plans. The button will work, but you need to verify the payment flow works properly.

### Test Steps:

1. **Open Dashboard**
   ```
   http://localhost:8000/crypto-screener/dist/dashboard.html
   ```

2. **Log in** with your test account

3. **Click a Subscription Button**
   - Scroll to "Account & Plan" section
   - Click a PayPal button

4. **Complete Test Payment**
   - PayPal popup appears
   - Use sandbox test card: `4532015112830366`
   - Expires: 12/2025
   - CVV: 123

---

## Verify Plans Were Created

### In PayPal Dashboard:
1. Go to Settings → Billing Plans
2. You should see your three plans listed
3. Plans should show as "Active"

### Via API:
```bash
curl -X GET https://api.sandbox.paypal.com/v1/billing/plans \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Update Dashboard Configuration (Optional)

Once plans are created, update the dashboard to use plan IDs:

```javascript
const paypalPlans = {
    25: { price: '24.90', name: 'Rallye 25', planId: 'PLAN_25' },
    50: { price: '49.90', name: 'Rallye 50', planId: 'PLAN_50' },
    100: { price: '99.90', name: 'ELITE PLAN - Rallye 100', planId: 'PLAN_100' }
};
```

Change the button creation to:
```javascript
createSubscription: function(data, actions) {
    return actions.subscription.create({
        plan_id: paypalPlans[planId].planId
    });
}
```

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Plan doesn't exist | Create plans in PayPal |
| Invalid Client ID | Wrong credentials | Verify Client ID is correct |
| SDK not loading | Network issue | Check PayPal SDK URL parameters |
| Button not rendering | Container not found | Ensure `<div id="paypal-button-container-XX">` exists |

---

## Resources

- **PayPal Developer**: https://developer.paypal.com
- **Billing Plans API**: https://developer.paypal.com/docs/subscriptions/
- **Sandbox Testing**: https://sandbox.paypal.com
- **API Reference**: https://developer.paypal.com/docs/api/

---

**Status**: Implementation ready, awaiting plan creation
**Next Step**: Create plans in PayPal sandbox account
