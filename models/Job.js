const mongoose = require('mongoose');
const SpecificationsSchema = require('./Specifications'); 

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  region: { type: String, required: true },
  service: { type: String, required: true },
  roleArn: { type: String, required: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  scheduling: {
    type: {
      type: String,
      enum: ['cron', 'interval', 'one-time'],
      required: true
    },
    value: { type: String, required: true }
  },
  specifications: SpecificationsSchema.schema,
  notifications: {
    email: { type: String },
    sms: { type: String },
    webhookUrl: { type: String },
    thresholdBreached: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Job', JobSchema);
