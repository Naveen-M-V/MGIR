const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['CREATED', 'APPROVED', 'COMPLETED', 'FAILED', 'CANCELLED'],
      default: 'CREATED'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'EUR'
    },
    description: {
      type: String,
      required: true
    },
    serviceType: {
      type: String,
      enum: [
        'tour',
        'personal_curator',
        'personal_companion',
        'car_rental',
        'private_chauffeur',
        'airport_transfer',
        'beauty_service',
        'babysitting',
        'pet_sitting'
      ],
      required: true
    },
    customerInfo: {
      name: String,
      email: String,
      phone: String,
      firstName: String,
      lastName: String
    },
    bookingDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    paypalResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    transactionId: String,
    payerEmail: String,
    payerStatus: String,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  },
  { timestamps: true }
);

// Index for querying payments by user and date
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
