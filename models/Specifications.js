const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specificationsSchema = new Schema({
  service: {
    type: String,
    required: true,
    enum: ['ec2', 's3', 'rds'],
  },
  details: {
    ec2: {
      maxInstances: Number,
      minInstances: Number,
      instanceType: String,
    },
    s3: {
      maxBuckets: Number,
      bucketPrefix: String,
      storageLimit: Number,
    },
    rds: {
      maxDBInstances: Number,
      dbEngine: String,
      dbInstanceClass: String,
    }
  }
});

module.exports = mongoose.model('Specifications', specificationsSchema);
