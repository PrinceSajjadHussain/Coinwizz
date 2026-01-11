# PayPal Sandbox Payment Integration - Updated

## ✅ Implementation Changed

The system now uses **PayPal Standard Subscriptions** (Form-based approach) instead of the REST API. This approach is more reliable and doesn't require pre-made subscription plans.

---

## How It Works

### Payment Flow
1. **User clicks "Jetzt upgraden"** button
2. **JavaScript creates PayPal form** with subscription details
3. **Form submits to PayPal Sandbox**
4. **User completes payment on PayPal**
5. **Returns to dashboard** with confirmation

---

## Configuration Details

### PayPal Business Account
- **Email**: `sb-lq6hp48254000@business.example.com`
- **Sandbox URL**: https://sandbox.paypal.com
- **Form Action**: `https://www.sandbox.paypal.com/cgi-bin/webscr`

### Subscription Plans
| Plan | Price | Duration | Coins |
|------|-------|----------|-------|
| Rallye 25 | €24.90 | Monthly | 25 |
| Rallye 50 | €49.90 | Monthly | 50 |
| Rallye 100 | €99.90 | Monthly | 100 |

---

## Testing the Integration

### Step 1: Log In
```
URL: http://localhost:8000/crypto-screener/dist/dashboard.html
Login with any test user
```

### Step 2: Click Upgrade Button
- Scroll to "Account & Plan" section
- Click "Jetzt upgraden →" on desired plan
- Confirm the upgrade dialog

### Step 3: Complete Payment
- You'll be redirected to PayPal Sandbox
- Login with: `sb-lq6hp48254000@business.example.com`
- Password: `IF6r%{3:`
- Review subscription details
- Click "Subscribe" to complete

### Step 4: Verify
- PayPal will redirect back to dashboard
- Payment confirmation message appears
- User can check PayPal account history

---

## Test Cards for PayPal Sandbox

You can use these cards when checking out on PayPal sandbox:

| Card Type | Number | Expires | CVV |
|-----------|--------|---------|-----|
| Visa | 4532015112830366 | 12/2025 | 123 |
| Mastercard | 5425233010103442 | 12/2025 | 123 |
| AmEx | 371449635398431 | 12/2025 | 1234 |

**Or use the PayPal business account to pay directly:**
- Email: `sb-lq6hp48254000@business.example.com`
- Password: `IF6r%{3:`

---

## Backend Setup (Optional)

To handle payment notifications and update user subscriptions automatically:

### 1. Enable IPN (Instant Payment Notification)

Go to PayPal Sandbox Account:
1. Settings → Notifications
2. Enable IPN
3. Set webhook URL: `https://your-domain.com/paypal-webhook`

### 2. Process IPN Notifications

Example Node.js webhook handler:
```javascript
app.post('/paypal-webhook', async (req, res) => {
    const txnId = req.body.txn_id;
    const txnType = req.body.txn_type;
    const custom = req.body.custom; // User email
    const itemNumber = req.body.item_number; // PLAN_25, PLAN_50, etc
    const mcGross = req.body.mc_gross; // Amount paid
    
    if (txnType === 'subscr_signup' || txnType === 'subscr_payment') {
        // Extract plan ID from item_number
        const planId = itemNumber.replace('PLAN_', '');
        
        // Update user's plan in database
        await updateUserPlan(custom, planId, txnId);
        
        // Send confirmation email
        await sendConfirmationEmail(custom, planId);
    }
    
    res.status(200).send('OK');
});
```

---

## Current Form Fields

The system submits these fields to PayPal:

```javascript
{
    'cmd': '_xclick-subscriptions',           // Tells PayPal this is a subscription
    'business': 'your-paypal-email',          // Your business account
    'item_name': plan.name,                   // Display name
    'item_number': 'PLAN_' + planId,         // Plan identifier
    'a3': plan.price,                         // Subscription amount
    'p3': '1',                                // Billing frequency
    't3': 'M',                                // Month (M=monthly)
    'src': '1',                               // Recurring billing enabled
    'sra': '1',                               // Reattempt on failure
    'currency_code': 'EUR',                   // Currency
    'return': currentPage,                    // Return URL after success
    'cancel_return': currentPage,             // Return URL if cancelled
    'notify_url': webhookUrl,                 // Webhook endpoint
    'custom': userEmail,                      // Track user
    'invoice': uniqueInvoiceNumber,           // Unique transaction ID
    'rm': '2',                                // Return method (GET)
    'no_shipping': '1'                        // Hide shipping
}
```

---

## Security Notes

### Current Implementation
- ✅ Works in sandbox mode
- ✅ No SDK dependency
- ✅ Simple form-based approach
- ⚠️ Backend webhook needs setup

### Production Checklist
- [ ] Change business email to production account
- [ ] Update webhook URL to production
- [ ] Enable HTTPS everywhere
- [ ] Implement IPN verification
- [ ] Store subscription info in database
- [ ] Add renewal tracking
- [ ] Implement cancellation handling
- [ ] Add receipt emails
- [ ] Monitor webhook logs

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Redirect to PayPal fails | Form not submitting | Check browser console for JS errors |
| Payment not returning | Webhook not configured | Setup IPN in PayPal settings |
| Plan not updating | No backend webhook | Implement webhook handler |
| User sees error | Invalid business email | Verify email in form code |

---

## Files Modified

```
✅ crypto-screener/dist/dashboard.html
   - Removed PayPal SDK
   - Changed to form-based buttons
   - Added upgradePlan() function

✅ crypto-screener/PAYPAL_SETUP.md
   - (Previous SDK documentation - can be archived)
```

---

## Next Steps

1. **Test Payment Flow**
   - Log in to dashboard
   - Click upgrade button
   - Complete test payment on PayPal
   - Verify redirect works

2. **Setup IPN Webhook** (Production)
   - Configure webhook URL in PayPal
   - Implement backend handler
   - Test transaction updates

3. **Launch to Production**
   - Update business account email
   - Switch webhook to production URL
   - Update return URLs
   - Monitor transactions

---

## Support Links

- **PayPal Sandbox**: https://sandbox.paypal.com
- **IPN Guide**: https://developer.paypal.com/docs/subscriptions/
- **Form Parameters**: https://developer.paypal.com/docs/classic/paypal-payments-pro/integration-guide/subscribe_variables/
- **Troubleshooting**: https://www.paypal.com/de/cgi-bin/webscr?cmd=_display-xclick-subscriptions-management

---

**Status**: ✅ Ready for Testing
**Method**: PayPal Standard Form Submission
**Date**: January 11, 2026
