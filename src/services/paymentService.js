import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const paymentService = {
  /**
   * Create a PayPal order
   */
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/create-order`, {
        amount: orderData.amount,
        currency: orderData.currency || 'EUR',
        description: orderData.description,
        serviceType: orderData.serviceType,
        customerInfo: {
          firstName: orderData.customerName?.split(' ')[0] || 'Guest',
          lastName: orderData.customerName?.split(' ')[1] || 'User',
          email: orderData.customerEmail || 'guest@example.com',
          phone: orderData.customerPhone
        },
        bookingDetails: orderData.bookingDetails
      });

      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Capture a PayPal order
   */
  captureOrder: async (orderId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/capture-order`, {
        orderId
      });

      return response.data;
    } catch (error) {
      console.error('Error capturing order:', error);
      throw error;
    }
  },

  /**
   * Get order details
   */
  getOrderDetails: async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  },

  /**
   * Get payment history for authenticated user
   */
  getPaymentHistory: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  /**
   * Get payment statistics (admin)
   */
  getPaymentStats: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }
};

export default paymentService;
