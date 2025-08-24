// OTP utility functions
const crypto = require('crypto');
// Removed nodemailer dependency to avoid installation issues
// const nodemailer = require('nodemailer');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set OTP expiration time (10 minutes from now)
const setOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

// Verify if OTP is valid and not expired
const isOTPValid = (storedOTP, inputOTP, expiryTime) => {
  if (!storedOTP || !expiryTime) {
    return false;
  }
  
  const now = new Date();
  return storedOTP === inputOTP && now < new Date(expiryTime);
};

// Mock SMS sending function (in production, replace with actual SMS gateway)
const sendSMS = async (phoneNumber, message) => {
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  // In a real implementation, you would use an SMS gateway service like Twilio, Nexmo, etc.
  // Example with Twilio:
  // await twilioClient.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phoneNumber
  // });
  
  return true; // Simulate successful sending
};

// Email sending function using nodemailer
const sendEmail = async (email, subject, message) => {
  console.log(`Sending Email to ${email}:`);
  
  try {
    const sendMail = require('./nodemailer');
    await sendMail(email, subject, message);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
  return true; // Simulate successful sending
};

module.exports = {
  generateOTP,
  setOTPExpiry,
  isOTPValid,
  sendSMS,
  sendEmail
};