const mongoose = require('mongoose');
const uuid = require('uuid');

const GatewaySchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    IP: {
      type: String,
      required: true,
    },
    peripherals: [
      {
        id: {
          type: String,
          default: () => uuid.v4(),
        },
        vendor: String,
        dateCreated: {
          type: Number,
          default: () => Date.now(),
        },
        status: Boolean,
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model('Gateway', GatewaySchema);
