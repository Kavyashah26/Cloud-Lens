# 🛠️ Cloud Resource Monitoring and Notification System

This application helps AWS users monitor their cloud resources and receive notifications when certain thresholds are breached. The system supports AWS services like EC2, S3, and RDS, allowing users to set up jobs that automatically check for overuse or underuse of their resources. Users can receive notifications via email, SMS, or webhook integrations.

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT authentication.
- **Monitor AWS Resources**: Set up jobs to monitor AWS EC2, S3, and RDS resources.
- **Threshold-Based Alerts**: Define thresholds for resource utilization and get alerts when these limits are crossed.
- **Multi-Channel Notifications**: Receive alerts via:
  - **Email** (Node mailer)
  - **SMS** (Twilio integration)
  - **Webhooks** (User-defined URL to trigger external services)
- **Job Scheduling**: Periodically check your resources using background jobs and cron-like scheduling.
- **Dashboard**: View, create, and manage all jobs linked to your account.

## 🖥️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Cloud Services**: AWS SDK (EC2, S3, RDS), Twilio for SMS
- **Notifications**: Nodemailer (SMTP support), Twilio, Webhooks
- **Hosting**: Vercel (for frontend) or EC2 (for full-stack deployment)
- **Authentication**: JWT (JSON Web Tokens)

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
4. [Usage](#usage)
5. [Notifications](#notifications)
6. [Deploying to AWS EC2](#deploying-to-aws-ec2)
7. [Contributing](#contributing)

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** (Atlas or local)
- **AWS Account** (with access to EC2, S3, and SES services)
- **Twilio Account** (for SMS notifications)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Kavyashah26/Cloud-Lens.git
    cd Cloud-Lens
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:

    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=5000
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-secret-key
    SENDER_EMAIL=your-email@gmail.com
    SENDER_EMAIL_PASSWORD=your-email-password
    AWS_ACCESS_KEY_ID=your-aws-access-key
    AWS_SECRET_ACCESS_KEY=your-aws-secret-key
    TWILIO_ACCOUNT_SID=your-twilio-sid
    TWILIO_AUTH_TOKEN=your-twilio-auth-token
    TWILIO_PHONE_NUMBER=your-twilio-number
    ```

4. Start the server:

    ```bash
    npm start
    ```

## 🌍 Environment Variables

| Variable                 | Description                                 |
| ------------------------ | ------------------------------------------- |
| `PORT`                   | The port on which the server runs           |
| `MONGO_URI`              | MongoDB connection string                   |
| `JWT_SECRET`             | Secret key for signing JWTs                 |
| `SENDER_EMAIL`           | Sender email for notifications              |
| `SENDER_EMAIL_PASSWORD`  | Email password for SMTP authentication      |
| `AWS_ACCESS_KEY_ID`      | AWS Access Key for SDK                      |
| `AWS_SECRET_ACCESS_KEY`  | AWS Secret Access Key for SDK               |
| `TWILIO_ACCOUNT_SID`     | Twilio account SID for SMS                  |
| `TWILIO_AUTH_TOKEN`      | Twilio authentication token                 |
| `TWILIO_PHONE_NUMBER`    | Twilio phone number for sending SMS         |

## 📑 API Endpoints

### Auth

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login to get a JWT token

### Jobs

- **GET** `/jobs` - Get all jobs for the logged-in user
- **POST** `/jobs/create` - Create a new job to monitor resources
- **DELETE** `/jobs/stop` - Stop and delete a job


## 🚀 Usage

1. **Register and Login**: Users must first register and log in to access the application’s dashboard and features.
2. **Create a Job**: Users can create jobs to monitor their AWS resources by specifying thresholds.
3. **Notifications**: The system will notify users via email, SMS, or webhooks when a threshold is breached.

## 📧 Notifications

- **Email**: Notifications are sent to the registered user's email via SMTP.

## 🚀 Deploying to AWS EC2

1. Launch an EC2 instance and SSH into it.
2. Install Node.js and MongoDB.
3. Clone the repository and follow the [Installation](#installation) steps.
4. Set up a system service for the app to keep it running.

## 🛠 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request
