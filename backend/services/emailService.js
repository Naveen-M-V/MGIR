const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - My Guide In Rome',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">My Guide In Rome</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Welcome to My Guide In Rome! To complete your account registration, please verify your email address using the code below.
            </p>
            
            <div style="background: white; border: 2px solid #667eea; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="color: #999; font-size: 14px; margin: 0 0 15px 0;">Your Verification Code</p>
              <p style="color: #667eea; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 10px;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This code will expire in <strong>15 minutes</strong>. If you didn't request this verification, please ignore this email.
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              For security reasons, never share this code with anyone.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2024 My Guide In Rome. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to My Guide In Rome!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">My Guide In Rome</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Welcome, ${fullName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your email has been successfully verified. Your account is now active and ready to use.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2024 My Guide In Rome. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail
};
