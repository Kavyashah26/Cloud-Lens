module.exports = {
    aws: {
      region: process.env.AWS_REGION,
      ses: {
        senderEmail: process.env.SENDER_EMAIL,
      },
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
      },
    },
  };
  