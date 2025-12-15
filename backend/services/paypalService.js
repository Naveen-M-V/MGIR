const axios = require('axios');
require('dotenv').config();

// PayPal API endpoints
const SANDBOX_API = 'https://api.sandbox.paypal.com';
const LIVE_API = 'https://api.paypal.com';

const API_BASE = process.env.PAYPAL_MODE === 'sandbox' ? SANDBOX_API : LIVE_API;

// Get PayPal access token
const getAccessToken = async () => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('PayPal Client ID or Client Secret not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env');
    }

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString('base64');

    const response = await axios.post(
      `${API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with PayPal: ' + (error.response?.data?.error_description || error.message));
  }
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create PayPal order
const createOrder = async (orderData) => {
  try {
    const accessToken = await getAccessToken();

    // Validate and sanitize email
    let customerEmail = orderData.customer?.email || 'guest@example.com';
    if (!isValidEmail(customerEmail)) {
      console.warn(`Invalid email format: ${customerEmail}, using default`);
      customerEmail = 'guest@example.com';
    }

    // Parse customer name
    const fullName = orderData.customer?.name || 'Guest User';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: orderData.currency || 'EUR',
            value: orderData.amount.toString()
          },
          description: orderData.description,
          custom_id: orderData.orderId || `ORDER-${Date.now()}`
        }
      ],
      payer: {
        name: {
          given_name: firstName,
          surname: lastName
        },
        email_address: customerEmail
      },
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        brand_name: 'My Guide In Rome',
        locale: 'en-US',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const response = await axios.post(
      `${API_BASE}/v2/checkout/orders`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      orderId: response.data.id,
      status: response.data.status,
      links: response.data.links
    };
  } catch (error) {
    console.error('Error creating PayPal order:', error.response?.data || error.message);
    throw new Error('Failed to create PayPal order');
  }
};

// Capture PayPal order
const captureOrder = async (orderId) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      orderId: response.data.id,
      status: response.data.status,
      paymentSource: response.data.payment_source,
      purchaseUnits: response.data.purchase_units
    };
  } catch (error) {
    console.error('Error capturing PayPal order:', error.response?.data || error.message);
    throw new Error('Failed to capture PayPal order');
  }
};

// Get order details
const getOrderDetails = async (orderId) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${API_BASE}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      orderId: response.data.id,
      status: response.data.status,
      payer: response.data.payer,
      purchaseUnits: response.data.purchase_units
    };
  } catch (error) {
    console.error('Error getting PayPal order details:', error.response?.data || error.message);
    throw new Error('Failed to get order details');
  }
};

module.exports = {
  getAccessToken,
  createOrder,
  captureOrder,
  getOrderDetails
};
