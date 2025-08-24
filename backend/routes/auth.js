const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateOTP, setOTPExpiry, isOTPValid, sendSMS, sendEmail } = require('../utils/otpUtils');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = setOTPExpiry();

    // Create new user
    user = new User({
      name,
      email,
      password,
      otpCode: otp,
      otpExpires,
      // Auto-verify user for development purposes
      isEmailVerified: true
    });

    // Save user to database
    await user.save();

    // Log instead of sending email in development
    console.log(`Development mode: Verification OTP for ${email} is ${otp}`);
    
    // Skip actual email sending in development
    // const emailSubject = 'Email Verification for FinPro';
    // const emailMessage = `
    //   <h1>Welcome to FinPro!</h1>
    //   <p>Thank you for registering. Please verify your email with the following code:</p>
    //   <h2>${otp}</h2>
    //   <p>This code will expire in 10 minutes.</p>
    // `;
    // await sendEmail(email, emailSubject, emailMessage);

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: true
      },
      requiresVerification: false
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate new OTP if previous one expired
      if (!user.otpExpires || new Date() > new Date(user.otpExpires)) {
        const otp = generateOTP();
        const otpExpires = setOTPExpiry();
        
        user.otpCode = otp;
        user.otpExpires = otpExpires;
        await user.save();
        
        // Send verification email
        const emailSubject = 'Email Verification for FinPro';
        const emailMessage = `
          <h1>Welcome to FinPro!</h1>
          <p>Please verify your email with the following code:</p>
          <h2>${otp}</h2>
          <p>This code will expire in 10 minutes.</p>
        `;
        await sendEmail(email, emailSubject, emailMessage);
      }
      
      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isEmailVerified: false
        },
        requiresVerification: true
      });
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid
    if (!isOTPValid(user.otpCode, otp, user.otpExpires)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: true
      },
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/resend-otp
// @desc    Resend OTP to email
// @access  Public
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = setOTPExpiry();
    
    // Update user with new OTP
    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();
    
    // Send verification email
    const emailSubject = 'Email Verification for FinPro';
    const emailMessage = `
      <h1>Welcome to FinPro!</h1>
      <p>Here is your new verification code:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
    `;
    await sendEmail(email, emailSubject, emailMessage);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/send-otp
// @desc    Send OTP to user's phone
// @access  Private
router.post('/send-otp', auth, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpires = setOTPExpiry();
    
    // Update user with OTP and phone
    await User.findByIdAndUpdate(req.user.id, {
      phone,
      otpCode: otp,
      otpExpires
    });
    
    // Send OTP via SMS
    const message = `Your FinTooz verification code is: ${otp}. Valid for 10 minutes.`;
    await sendSMS(phone, message);
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and mark phone as verified
// @access  Private
router.post('/verify-otp', auth, async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }
    
    // Get user with OTP details
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify OTP
    if (!isOTPValid(user.otpCode, otp, user.otpExpires)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Mark phone as verified and clear OTP
    user.isPhoneVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.json({ message: 'Phone verified successfully', isPhoneVerified: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;