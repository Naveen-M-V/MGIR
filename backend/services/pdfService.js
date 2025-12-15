const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create receipts directory if it doesn't exist
const receiptsDir = path.join(__dirname, '../receipts');
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

/**
 * Generate a PDF receipt for a payment
 */
const generateReceiptPDF = async (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `receipt_${paymentData.orderId}_${Date.now()}.pdf`;
      const filePath = path.join(receiptsDir, fileName);
      const stream = fs.createWriteStream(filePath);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('MY GUIDE IN ROME', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('Professional Tourism Services', { align: 'center' });
      doc.moveDown(0.5);

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('PAYMENT RECEIPT', { align: 'center' });
      doc.moveDown(1);

      // Receipt Details
      doc.fontSize(10).font('Helvetica');
      
      // Left column
      doc.text('RECEIPT DETAILS', { underline: true });
      doc.text(`Receipt #: ${paymentData.orderId}`);
      doc.text(`Date: ${new Date(paymentData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`);
      doc.text(`Time: ${new Date(paymentData.createdAt).toLocaleTimeString('en-US')}`);
      doc.text(`Status: ${paymentData.status}`);
      
      doc.moveDown(1);

      // Customer Information
      doc.text('CUSTOMER INFORMATION', { underline: true });
      if (paymentData.customerInfo?.firstName) {
        doc.text(`Name: ${paymentData.customerInfo.firstName} ${paymentData.customerInfo.lastName || ''}`);
      }
      if (paymentData.customerInfo?.email) {
        doc.text(`Email: ${paymentData.customerInfo.email}`);
      }
      if (paymentData.customerInfo?.phone) {
        doc.text(`Phone: ${paymentData.customerInfo.phone}`);
      }

      doc.moveDown(1);

      // Service Details
      doc.text('SERVICE DETAILS', { underline: true });
      doc.text(`Service Type: ${formatServiceType(paymentData.serviceType)}`);
      doc.text(`Description: ${paymentData.description}`);

      if (paymentData.bookingDetails) {
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica-Bold').text('Booking Details:');
        doc.fontSize(9).font('Helvetica');
        
        if (paymentData.bookingDetails.date) {
          doc.text(`  • Date: ${paymentData.bookingDetails.date}`);
        }
        if (paymentData.bookingDetails.time) {
          doc.text(`  • Time: ${paymentData.bookingDetails.time}`);
        }
        if (paymentData.bookingDetails.service) {
          doc.text(`  • Service: ${paymentData.bookingDetails.service}`);
        }
        if (paymentData.bookingDetails.locationType) {
          doc.text(`  • Location Type: ${paymentData.bookingDetails.locationType}`);
        }
        if (paymentData.bookingDetails.address) {
          doc.text(`  • Address: ${paymentData.bookingDetails.address}`);
        }
      }

      doc.moveDown(1.5);

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Payment Summary
      doc.fontSize(12).font('Helvetica-Bold').text('PAYMENT SUMMARY', { align: 'center' });
      doc.moveDown(0.5);

      // Create a simple table for payment summary
      const summaryY = doc.y;
      doc.fontSize(10).font('Helvetica');
      doc.text('Amount:', 100);
      doc.fontSize(10).font('Helvetica-Bold').text(`${paymentData.currency} ${paymentData.amount.toFixed(2)}`, 300, summaryY);

      doc.moveDown(1);

      // Transaction ID
      if (paymentData.transactionId) {
        doc.fontSize(9).font('Helvetica');
        doc.text(`Transaction ID: ${paymentData.transactionId}`);
      }

      doc.moveDown(2);

      // Footer
      doc.fontSize(8).font('Helvetica').text('Thank you for your business!', { align: 'center' });
      doc.text('For inquiries, please contact us at info@myguideinrome.com', { align: 'center' });
      doc.text('© 2024 My Guide In Rome. All rights reserved.', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve({
          success: true,
          filePath: filePath,
          fileName: fileName
        });
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
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

/**
 * Delete a PDF file
 */
const deletePDF = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  generateReceiptPDF,
  formatServiceType,
  deletePDF,
  receiptsDir
};
