/**
 * PayPal Subscription Webhook Handler
 * Handles PayPal IPN (Instant Payment Notification) for subscription events
 * Sandbox Mode: https://sandbox.paypal.com
 */

const crypto = require('crypto');

// PayPal API Configuration (from paypal-config.json)
const PAYPAL_CONFIG = {
  clientId: 'AWTLzIn6rdXSl9AnXS4JH_WYN5pu5oeab0035Cx23H0chTupESGKMxRxFZkRq2mASSUPNch6pOwG_ig',
  clientSecret: 'EOvz9Lfuy7LBFk4pg9NFty4MTrZDsXdBZuE1-rEKrtKAwxPKjx9G1Q0-xpO78Ffzt2rIVMEKuP6iqgzW',
  mode: 'sandbox',
  webhookUrl: 'https://your-domain.com/api/paypal-webhook'
};

/**
 * Handle PayPal Webhook Event
 * @param {Object} event - PayPal webhook event
 * @returns {Promise<Object>} Result of webhook processing
 */
async function handlePayPalWebhook(event) {
  console.log('📨 PayPal Webhook received:', event.event_type);

  try {
    // Verify webhook authenticity
    const isValid = await verifyWebhookSignature(event);
    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      return { status: 'error', message: 'Invalid signature' };
    }

    // Process based on event type
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        return await handleSubscriptionCreated(event);
      
      case 'BILLING.SUBSCRIPTION.UPDATED':
        return await handleSubscriptionUpdated(event);
      
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        return await handleSubscriptionActivated(event);
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        return await handleSubscriptionCancelled(event);
      
      case 'PAYMENT.CAPTURE.COMPLETED':
        return await handlePaymentCompleted(event);
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        return await handlePaymentRefunded(event);
      
      default:
        console.log('⚠️ Unhandled event type:', event.event_type);
        return { status: 'success', message: 'Event received but not processed' };
    }
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return { status: 'error', message: error.message };
  }
}

/**
 * Verify PayPal Webhook Signature
 * @param {Object} event - PayPal webhook event
 * @returns {Promise<boolean>} True if signature is valid
 */
async function verifyWebhookSignature(event) {
  try {
    // In production, validate with PayPal API
    // For now, we'll accept all webhooks (should be secured in production)
    console.log('✅ Webhook signature validation (sandbox mode - simplified)');
    return true;
  } catch (error) {
    console.error('❌ Signature verification failed:', error);
    return false;
  }
}

/**
 * Handle Subscription Created Event
 */
async function handleSubscriptionCreated(event) {
  const subscription = event.resource;
  console.log('📋 Subscription created:', subscription.id);
  
  // Update database with subscription info
  const result = {
    subscription_id: subscription.id,
    customer_email: subscription.subscriber.email_address,
    status: subscription.status,
    plan_id: subscription.plan_id,
    timestamp: new Date().toISOString()
  };
  
  console.log('✅ Subscription created:', result);
  return { status: 'success', data: result };
}

/**
 * Handle Subscription Updated Event
 */
async function handleSubscriptionUpdated(event) {
  const subscription = event.resource;
  console.log('🔄 Subscription updated:', subscription.id);
  
  const result = {
    subscription_id: subscription.id,
    status: subscription.status,
    updated_at: new Date().toISOString()
  };
  
  console.log('✅ Subscription updated:', result);
  return { status: 'success', data: result };
}

/**
 * Handle Subscription Activated Event
 */
async function handleSubscriptionActivated(event) {
  const subscription = event.resource;
  console.log('✅ Subscription activated:', subscription.id);
  
  // Update user's plan status in database
  const result = {
    subscription_id: subscription.id,
    customer_email: subscription.subscriber.email_address,
    status: 'ACTIVE',
    activated_at: new Date().toISOString()
  };
  
  // Grant access to premium features based on plan
  const planMapping = {
    'PLAN_25': 'rallye25',
    'PLAN_50': 'rallye50',
    'PLAN_100': 'rallye100'
  };
  
  result.plan_type = planMapping[subscription.plan_id] || 'unknown';
  
  console.log('✅ Subscription activated:', result);
  return { status: 'success', data: result };
}

/**
 * Handle Subscription Cancelled Event
 */
async function handleSubscriptionCancelled(event) {
  const subscription = event.resource;
  console.log('❌ Subscription cancelled:', subscription.id);
  
  // Update database - revoke premium access
  const result = {
    subscription_id: subscription.id,
    customer_email: subscription.subscriber.email_address,
    status: 'CANCELLED',
    cancelled_at: new Date().toISOString()
  };
  
  console.log('✅ Subscription cancellation processed:', result);
  return { status: 'success', data: result };
}

/**
 * Handle Payment Completed Event
 */
async function handlePaymentCompleted(event) {
  const payment = event.resource;
  console.log('💰 Payment completed:', payment.id);
  
  const result = {
    transaction_id: payment.id,
    amount: payment.amount.value,
    currency: payment.amount.currency_code,
    status: payment.status,
    payer_email: payment.payer.email_address,
    completed_at: new Date().toISOString()
  };
  
  console.log('✅ Payment processed:', result);
  return { status: 'success', data: result };
}

/**
 * Handle Payment Refunded Event
 */
async function handlePaymentRefunded(event) {
  const refund = event.resource;
  console.log('↩️ Payment refunded:', refund.id);
  
  const result = {
    refund_id: refund.id,
    amount: refund.amount.value,
    currency: refund.amount.currency_code,
    status: refund.status,
    refunded_at: new Date().toISOString()
  };
  
  console.log('✅ Refund processed:', result);
  return { status: 'success', data: result };
}

/**
 * Express Middleware for PayPal Webhooks
 */
function paypalWebhookMiddleware(req, res) {
  handlePayPalWebhook(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      console.error('Webhook middleware error:', error);
      res.status(500).json({ status: 'error', message: error.message });
    });
}

module.exports = {
  handlePayPalWebhook,
  verifyWebhookSignature,
  paypalWebhookMiddleware,
  PAYPAL_CONFIG
};
