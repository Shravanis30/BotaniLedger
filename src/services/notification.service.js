const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger.util');

class NotificationService {
  constructor() {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPushNotification(token, title, body, data = {}) {
    try {
      const message = {
        notification: { title, body },
        data,
        token,
      };
      const response = await admin.messaging().send(message);
      return response;
    } catch (err) {
      logger.error('Push notification failed:', err);
    }
  }

  async sendEmail(to, subject, text, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `BotaniLedger <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });
      return info;
    } catch (err) {
      logger.error('Email failed:', err);
    }
  }
}

module.exports = new NotificationService();
