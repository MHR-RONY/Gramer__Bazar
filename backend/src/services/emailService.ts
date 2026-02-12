import { brevoApiInstance } from '../config/brevo.js';
import config from '../config/index.js';
import SibApiV3Sdk from 'sib-api-v3-sdk';

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  name?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: config.brevo.senderEmail,
      name: config.brevo.senderName,
    };

    sendSmtpEmail.to = [
      {
        email: options.to,
        name: options.name || '',
      },
    ];

    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.htmlContent;

    await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export const sendOTP = async (
  email: string,
  otp: string,
  name?: string
): Promise<void> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; background-color: white; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Gramer Bazar</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email</h2>
          <p>Hello${name ? ' ' + name : ''},</p>
          <p>Your One-Time Password (OTP) for email verification is:</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Gramer Bazar. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Email Verification - Gramer Bazar',
    htmlContent,
    name,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  name?: string
): Promise<void> => {
  const resetUrl = `${config.cors.origin}/reset-password/${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Gramer Bazar</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hello${name ? ' ' + name : ''},</p>
          <p>You have requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p>${resetUrl}</p>
          <p>This link is valid for 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Gramer Bazar. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset - Gramer Bazar',
    htmlContent,
    name,
  });
};

export const sendOrderConfirmation = async (
  email: string,
  orderDetails: any,
  name?: string
): Promise<void> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-id { font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Gramer Bazar</h1>
        </div>
        <div class="content">
          <h2>Order Confirmed!</h2>
          <p>Hello${name ? ' ' + name : ''},</p>
          <p>Thank you for your order!</p>
          <div class="order-id">Order ID: ${orderDetails.orderId}</div>
          <p>Total Amount: ৳${orderDetails.totalPrice}</p>
          <p>We'll notify you when your order is on the way.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Gramer Bazar. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Order Confirmation - Gramer Bazar',
    htmlContent,
    name,
  });
};

export default {
  sendEmail,
  sendOTP,
  sendPasswordResetEmail,
  sendOrderConfirmation,
};
