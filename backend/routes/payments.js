const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const paypalService = require('../services/paypalService');
const pdfService = require('../services/pdfService');
const whatsappService = require('../services/whatsappService');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/payments/create-order
 * @desc    Create a PayPal order
 * @access  Public
 */
router.post('/create-order', async (req, res) => {
  try {
    const {
      amount,
      currency = 'EUR',
      description,
      serviceType,
      customerInfo,
      bookingDetails,
      orderId
    } = req.body;

    // Validate required fields
    if (!amount || !description || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, description, serviceType'
      });
    }

    // Create payment record in database
    const payment = new Payment({
      orderId: orderId || `ORDER-${Date.now()}`,
      userId: req.user?.id || null,
      status: 'CREATED',
      amount,
      currency,
      description,
      serviceType,
      customerInfo,
      bookingDetails
    });

    await payment.save();

    // Create PayPal order
    const paypalOrder = await paypalService.createOrder({
      amount,
      currency,
      description,
      orderId: payment._id.toString(),
      customer: customerInfo
    });

    // Update payment with PayPal order ID
    payment.orderId = paypalOrder.orderId;
    await payment.save();

    res.json({
      success: true,
      orderId: paypalOrder.orderId,
      status: paypalOrder.status,
      links: paypalOrder.links
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
});

/**
 * @route   POST /api/payments/capture-order
 * @desc    Capture a PayPal order
 * @access  Public
 */
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Capture the order
    const capturedOrder = await paypalService.captureOrder(orderId);

    // Update payment record
    const payment = await Payment.findOne({ orderId });
    if (payment) {
      payment.status = 'COMPLETED';
      payment.paypalResponse = capturedOrder;
      payment.transactionId = capturedOrder.purchaseUnits?.[0]?.payments?.captures?.[0]?.id;
      payment.payerEmail = capturedOrder.payer?.email_address;
      payment.payerStatus = capturedOrder.payer?.status;
      payment.completedAt = new Date();
      await payment.save();

      // Generate PDF receipt
      try {
        const pdfResult = await pdfService.generateReceiptPDF(payment);
        console.log('PDF generated:', pdfResult.fileName);

        const backendBaseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
        const pdfUrl = `${backendBaseUrl}/receipts/${encodeURIComponent(pdfResult.fileName)}`;

        // Send WhatsApp message with PDF to constant number
        const whatsappResult = await whatsappService.sendPaymentReceipt(
          payment,
          pdfUrl
        );
        console.log('WhatsApp result:', whatsappResult);
      } catch (pdfError) {
        console.error('Error generating PDF or sending WhatsApp:', pdfError);
        // Don't fail the payment if PDF/WhatsApp fails
      }
    }

    res.json({
      success: true,
      message: 'Payment captured successfully',
      orderId: capturedOrder.orderId,
      status: capturedOrder.status,
      transactionId: payment?.transactionId
    });
  } catch (error) {
    console.error('Error capturing order:', error);
    
    // Update payment status to failed
    const { orderId } = req.body;
    if (orderId) {
      const payment = await Payment.findOne({ orderId });
      if (payment) {
        payment.status = 'FAILED';
        await payment.save();
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to capture order'
    });
  }
});

/**
 * @route   GET /api/payments/order/:orderId
 * @desc    Get order details
 * @access  Public
 */
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order details from PayPal
    const orderDetails = await paypalService.getOrderDetails(orderId);

    // Get payment record from database
    const payment = await Payment.findOne({ orderId });

    res.json({
      success: true,
      paypalOrder: orderDetails,
      payment: payment ? {
        _id: payment._id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        description: payment.description,
        serviceType: payment.serviceType,
        customerInfo: payment.customerInfo,
        createdAt: payment.createdAt
      } : null
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get order details'
    });
  }
});

/**
 * @route   GET /api/payments/history
 * @desc    Get payment history for authenticated user
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
});

/**
 * @route   GET /api/payments/stats
 * @desc    Get payment statistics (admin only)
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
  try {
    // Check if user is admin (you can add this check based on your auth system)
    const stats = await Payment.aggregate([
      {
        $match: { status: 'COMPLETED' }
      },
      {
        $group: {
          _id: '$serviceType',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    const totalRevenue = await Payment.aggregate([
      {
        $match: { status: 'COMPLETED' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats,
      totalRevenue: totalRevenue[0] || { total: 0, count: 0 }
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics'
    });
  }
});

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle PayPal webhook events
 * @access  Public
 */
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    // Log webhook event
    console.log('PayPal Webhook Event:', event.event_type);

    // Handle different event types
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED':
        // Order completed
        const orderId = event.resource?.id;
        if (orderId) {
          const payment = await Payment.findOne({ orderId });
          if (payment) {
            payment.status = 'APPROVED';
            await payment.save();
          }
        }
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        // Payment captured
        const captureId = event.resource?.supplementary_data?.related_ids?.order_id;
        if (captureId) {
          const payment = await Payment.findOne({ orderId: captureId });
          if (payment) {
            payment.status = 'COMPLETED';
            payment.transactionId = event.resource?.id;
            payment.completedAt = new Date();
            await payment.save();
          }
        }
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        // Payment denied
        const deniedOrderId = event.resource?.supplementary_data?.related_ids?.order_id;
        if (deniedOrderId) {
          const payment = await Payment.findOne({ orderId: deniedOrderId });
          if (payment) {
            payment.status = 'FAILED';
            await payment.save();
          }
        }
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        // Order approved
        const approvedOrderId = event.resource?.id;
        if (approvedOrderId) {
          const payment = await Payment.findOne({ orderId: approvedOrderId });
          if (payment) {
            payment.status = 'APPROVED';
            await payment.save();
          }
        }
        break;
    }

    // Return 200 OK to acknowledge receipt
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook'
    });
  }
});

module.exports = router;
