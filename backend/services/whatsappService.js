const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
} else {
  console.warn('Twilio credentials not configured. WhatsApp service will not work.');
}

/**
 * Send a WhatsApp message with PDF attachment
 * @param {string} recipientPhone - Recipient phone number in format +1234567890
 * @param {string} message - Message text
 * @param {string} pdfFilePath - Path to PDF file to attach
 */
const sendWhatsAppMessage = async (recipientPhone, message, pdfFilePath = null) => {
  try {
    if (!client) {
      throw new Error('Twilio client not initialized. Please configure TWILIO credentials in .env');
    }

    // Validate phone number format
    if (!recipientPhone.startsWith('+')) {
      throw new Error('Phone number must be in format +1234567890');
    }

    const fromNumber = twilioPhoneNumber?.startsWith('whatsapp:')
      ? twilioPhoneNumber
      : `whatsapp:${twilioPhoneNumber}`;

    // Send message via WhatsApp
    const messageData = {
      from: fromNumber,
      to: `whatsapp:${recipientPhone}`,
      body: message
    };

    // If PDF file path is provided, add media URL
    if (pdfFilePath) {
      // For WhatsApp attachments, files need to be publicly accessible
      // For now, we'll send the message and log the PDF location
      // TODO: Implement file hosting for PDF attachments
      console.log(`PDF receipt generated: ${pdfFilePath}`);
      messageData.mediaUrl = [pdfFilePath];
      messageData.body += `\n\n📄 PDF Receipt: Available in system receipts folder`;
    }

    const result = await client.messages.create(messageData);

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      message: 'WhatsApp message sent successfully'
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      message: error.message || 'Failed to send WhatsApp message'
    };
  }
};

/**
 * Send payment receipt via WhatsApp to constant number
 */
const sendPaymentReceipt = async (paymentData, pdfFilePath) => {
  try {
    // Constant WhatsApp number for all receipts
    const recipientPhone = '+919788394119';
    
    // Format the message
    const message = formatReceiptMessage(paymentData);

    // Send via WhatsApp with PDF
    const result = await sendWhatsAppMessage(recipientPhone, message, pdfFilePath);

    return result;
  } catch (error) {
    console.error('Error sending payment receipt:', error);
    return {
      success: false,
      message: error.message || 'Failed to send payment receipt'
    };
  }
};

/**
 * Format payment data into a readable message
 */
const formatReceiptMessage = (paymentData) => {
  const serviceType = formatServiceType(paymentData.serviceType);
  const date = new Date(paymentData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  let message = `🎉 *Payment Confirmation*\n\n`;
  message += `Thank you for your payment!\n\n`;
  message += `📋 *Receipt Details*\n`;
  message += `Receipt #: ${paymentData.orderId}\n`;
  message += `Date: ${date}\n`;
  message += `Status: ${paymentData.status}\n\n`;

  message += `🛎️ *Service Details*\n`;
  message += `Service: ${serviceType}\n`;
  message += `Description: ${paymentData.description}\n\n`;

  message += `💰 *Payment Summary*\n`;
  message += `Amount: ${paymentData.currency} ${paymentData.amount.toFixed(2)}\n\n`;

  if (paymentData.transactionId) {
    message += `Transaction ID: ${paymentData.transactionId}\n\n`;
  }

  message += `Thank you for choosing My Guide In Rome!\n`;
  message += `For inquiries: info@myguideinrome.com`;

  return message;
};

/**
 * Format service type for display
 */
const formatServiceType = (serviceType) => {
  const serviceNames = {
    'tour': 'Tour',
    'personal_curator': 'Personal Curator',
    'personal_companion': 'Personal Companion',
    'car_rental': 'Car Rental',
    'private_chauffeur': 'Private Chauffeur',
    'airport_transfer': 'Airport Transfer',
    'beauty_service': 'Beauty Service',
    'babysitting': 'Babysitting',
    'pet_sitting': 'Pet Sitting'
  };
  return serviceNames[serviceType] || serviceType;
};

module.exports = {
  sendWhatsAppMessage,
  sendPaymentReceipt,
  formatReceiptMessage
};
