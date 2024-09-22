const { sendNotification } = require('../services/notificationService');

exports.checkAndSendNotification = async (job, resources, user) => {
  try {
    let thresholdBreached = false;

    // Extract specifications from the job
    const { specifications } = job;
    // console.log("specifications\n", specifications);
    // console.log("resources\n", resources);

    // Logic to check for EC2 instances
    if (job.service === 'ec2' && Array.isArray(resources)) {
      const ec2Specs = specifications.details.ec2;
      const instanceType = ec2Specs.instanceType;

      // Filter EC2 instances based on the specified instance type and state
      const filteredInstances = resources.filter(
        (instance) => instance.instanceType === instanceType && instance.state === 'running'
      );
      // console.log("filteredInstances:\n", filteredInstances);

      const runningInstances = filteredInstances.length;

      // Check if the running instances of the specified type exceed thresholds
      if (runningInstances > ec2Specs.maxInstances) {
        thresholdBreached = true;
        console.log(`Threshold breached for EC2 instances. Running: ${runningInstances}, Max: ${ec2Specs.maxInstances}`);
      } else if (runningInstances < ec2Specs.minInstances) {
        thresholdBreached = true;
        console.log(`Threshold breached for EC2 instances. Running: ${runningInstances}, Min: ${ec2Specs.minInstances}`);
      }
    }

    // Logic to check for S3 Buckets
    if (job.service === 's3' && Array.isArray(resources)) {
      const s3Specs = specifications.details.s3;
      const bucketPrefix = s3Specs.bucketPrefix;

      // Assume resources is an array of buckets for S3
      const filteredBuckets = resources.filter(
        (bucket) => bucket.name && bucket.name.startsWith(bucketPrefix)
      );

      const bucketCount = filteredBuckets.length;

      // Check if the bucket count exceeds the maximum allowed buckets
      if (bucketCount > s3Specs.maxBuckets) {
        thresholdBreached = true;
        console.log(`Threshold breached for S3 buckets. Current: ${bucketCount}, Max: ${s3Specs.maxBuckets}`);
      }

      // Check total storage limit across filtered buckets
      const totalStorage = filteredBuckets.reduce((total, bucket) => total + (bucket.size || 0), 0); // Assuming bucket.size holds storage data
      if (totalStorage > s3Specs.storageLimit) {
        thresholdBreached = true;
        console.log(`Threshold breached for S3 storage. Current: ${totalStorage} GB, Max: ${s3Specs.storageLimit} GB`);
      }
    }

    // Logic to check for RDS instances
    if (job.service === 'rds' && Array.isArray(resources)) {
      const rdsSpecs = specifications.details.rds;
      const dbEngine = rdsSpecs.dbEngine;
      const dbInstanceClass = rdsSpecs.dbInstanceClass;

      // Assume resources is an array of DB instances for RDS
      const filteredDBInstances = resources.filter(
        (dbInstance) =>
          dbInstance.engine === dbEngine &&
          dbInstance.dbInstanceClass === dbInstanceClass
      );

      const dbInstanceCount = filteredDBInstances.length;

      // Check if the DB instance count exceeds the maximum allowed instances
      if (dbInstanceCount > rdsSpecs.maxDBInstances) {
        thresholdBreached = true;
        console.log(`Threshold breached for RDS DB instances. Current: ${dbInstanceCount}, Max: ${rdsSpecs.maxDBInstances}`);
      }
    }

    // If any threshold is breached, trigger the notification function
    if (thresholdBreached) {

      console.log("p1");
      await sendNotification(job, resources, user);
      console.log("p2");
      
      console.log("Notification sent successfully.");
    } else {
      console.log("No thresholds breached, no notification sent.");
    }

  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
