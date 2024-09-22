const schedule = require('node-schedule');
const {listResourcesByService} = require('./awsService.js');
const Job = require('../models/Job');
const { checkAndSendNotification } = require('../controllers/notificationController');

const scheduleJob = (job,user) => {
  const { scheduling, service, region, specifications } = job;

  const jobFunction = async () => {
    try {
      console.log("before listing");
      
      const resources = await  listResourcesByService(service, region, job);
      checkAndSendNotification(job, resources,user);
      console.log("after listing");
      
      // console.log(resources);
      
    } catch (error) {
      console.error('Error executing scheduled job:', error);
    }
  };

  switch (scheduling.type) {
    case 'cron':
      schedule.scheduleJob(job._id.toString(), scheduling.value, jobFunction);
      break;
    case 'interval':
      setInterval(jobFunction, parseInt(scheduling.value, 10));
      break;
    case 'one-time':
      setTimeout(jobFunction, parseInt(scheduling.value, 10));
      break;
  }
};

const cancelJob = (jobId) => {
  const job = schedule.scheduledJobs[jobId.toString()];
  if (job) {
    job.cancel();
  }
};

module.exports = {
  scheduleJob,
  cancelJob,
};
