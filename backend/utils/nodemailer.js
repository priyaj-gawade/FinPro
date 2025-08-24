const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html, // Using HTML format for better email presentation
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Email error:', error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
};

module.exports = sendMail;