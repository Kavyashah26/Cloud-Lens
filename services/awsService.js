
const {
  STSClient,
  AssumeRoleCommand,
} = require('@aws-sdk/client-sts');
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { RDSClient, DescribeDBInstancesCommand } = require('@aws-sdk/client-rds');

// Remove hardcoded access key and secret access key
const assumeRole = async (region, roleArn, externalId) => {
  const stsClient = new STSClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: region,
});


  const assumeRoleParams = {
      RoleArn: roleArn,
      RoleSessionName: `Session-${Date.now()}`,
      DurationSeconds: 3600,
      ExternalId: externalId,
  };

  const command = new AssumeRoleCommand(assumeRoleParams);
  const data = await stsClient.send(command);

  return {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken,
  };
};

const listResourcesByService = async (service, region, job) => {
  const credentials = await assumeRole(region, job.roleArn, process.env.EXTERNAL_ID);

  switch (service) {
      case 'ec2':
          return listEC2Instances(region, credentials);
      case 's3':
          return listS3Buckets(region, credentials);
      case 'rds':
          return listRDSInstances(region, credentials);
      default:
          throw new Error(`Unsupported service: ${service}`);
  }
};

const listEC2Instances = async (region, credentials) => {
  const ec2Client = new EC2Client({
      region,
      credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
      },
  });

  const command = new DescribeInstancesCommand({});
  const data = await ec2Client.send(command);

  const instances = data.Reservations.map(reservation =>
      reservation.Instances.map(instance => ({
          instanceId: instance.InstanceId,
          instanceType: instance.InstanceType,
          state: instance.State.Name,
          launchTime: instance.LaunchTime,
      }))
  ).flat();

  return instances;
};

const listS3Buckets = async (region, credentials) => {
  const s3Client = new S3Client({
      region,
      credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
      },
  });

  const command = new ListBucketsCommand({});
  const data = await s3Client.send(command);

  const buckets = data.Buckets.map(bucket => ({
      name: bucket.Name,
      creationDate: bucket.CreationDate,
  }));

  return buckets;
};

const listRDSInstances = async (region, credentials) => {
  const rdsClient = new RDSClient({
      region,
      credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
      },
  });

  const command = new DescribeDBInstancesCommand({});
  const data = await rdsClient.send(command);

  const dbInstances = data.DBInstances.map(dbInstance => ({
      dbInstanceIdentifier: dbInstance.DBInstanceIdentifier,
      dbInstanceClass: dbInstance.DBInstanceClass,
      engine: dbInstance.Engine,
      dbInstanceStatus: dbInstance.DBInstanceStatus,
      endpoint: dbInstance.Endpoint.Address,
  }));

  return dbInstances;
};

module.exports = {
  assumeRole,
  listResourcesByService,
  listEC2Instances,
  listS3Buckets,
  listRDSInstances,
};
