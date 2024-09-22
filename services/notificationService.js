// const AWS = require('aws-sdk');
// const SES = new AWS.SES();
// const Twilio = require('twilio');
// const nodemailer = require('nodemailer');

// const sendNotification = async (job, resources) => {
//   const { notifications } = job;
//   console.log(notifications);
//   if (notifications.thresholdBreached) {
//     if (notifications.email) {
//       console.log("\n\n\n\n\nsending email");
      
//       await sendEmail(notifications.email, job, resources);
//       console.log("\n\n\n\n\sent email");
//     }
//     if (notifications.sms) {
//       await sendSMS(notifications.sms, job, resources);
//     }
//     if (notifications.webhookUrl) {
//       await sendWebhook(notifications.webhookUrl, job, resources);
//     }
//   }
// };

// // const sendEmail = async (email, job, resources) => {
// //   const params = {
// //     Destination: { ToAddresses: [email] },
// //     Message: {
// //       Body: { Text: { Data: `Resource threshold breached for job ${job._id}` } },
// //       Subject: { Data: 'AWS Resource Notification' }
// //     },
// //     Source: process.env.SENDER_EMAIL,
// //   };
// //   await SES.sendEmail(params).promise();
// // };

// const sendEmail = async (email, job, resources) => {
//   // Create a transporter object using SMTP transport
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail', // You can use other services like Outlook, Yahoo, etc.
//     auth: {
//       user: process.env.SENDER_EMAIL, // Sender email address
//       pass: process.env.SENDER_EMAIL_PASSWORD, // Email password or app-specific password
//     },
//   });

//   // Define email options
//   const mailOptions = {
//     from: process.env.SENDER_EMAIL, // Sender address
//     to: email, // Recipient address
//     subject: 'AWS Resource Notification', // Subject line
//     text: `Resource threshold breached for job ${job._id}`, // Plain text body
//   };

//   // Send email
//   await transporter.sendMail(mailOptions);
// };

// const sendSMS = async (phone, job, resources) => {
//   const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//   await twilioClient.messages.create({
//     body: `Resource threshold breached for job ${job._id}`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: phone,
//   });
// };

// const sendWebhook = async (url, job, resources) => {
//   const payload = { jobId: job._id, resources };
//   await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
// };

// module.exports = {
//   sendNotification,
// };


// const AWS = require('aws-sdk');
// const SES = new AWS.SES();
const Twilio = require('twilio');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch'); // Ensure this is installed

const sendNotification = async (job, resources, user) => {
  // const { notifications } = job;
  const email = user.email; // Get email from user object
  console.log("sendNotification email::\t",email);
  // console.log(notifications);
  
  // if (notifications.thresholdBreached) {
    if (email) {
      console.log("Sending email...");
      await sendEmail(email, job, resources);
      console.log("Email sent.");
    }
    // if (notifications.sms) {
    //   await sendSMS(notifications.sms, job, resources);
    // }
    // if (notifications.webhookUrl) {
    //   await sendWebhook(notifications.webhookUrl, job, resources);
    // }
  // }
};

const sendEmail = async (email, job) => {
  console.log("h1");
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like Outlook, Yahoo, etc.
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });
  console.log("h2");
  console.log("sendEmail\t",email);
  
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'AWS Resource Notification',
    text: `Resource threshold breached for job ${job._id}`,
  };
  
  await transporter.sendMail(mailOptions);
  console.log("h2");
};

const sendSMS = async (phone, job, resources) => {
  const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await twilioClient.messages.create({
    body: `Resource threshold breached for job ${job._id}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
};

const sendWebhook = async (url, job, resources) => {
  const payload = { jobId: job._id, resources };
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

module.exports = {
  sendNotification,
};
