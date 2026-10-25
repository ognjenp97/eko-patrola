const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 8;
        },
        message: 'Potrebna je bar jedna, a najvise 8 slika',
      },
    },
    afterImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 8;
        },
        message: 'Najviše 8 slika poslije čišćenja.',
      },
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    alreadyCleaned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'cleaned'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);