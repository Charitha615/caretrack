const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Email template function
const sendReportConfirmationEmail = async (reporterEmail, reporterName, reportNumber) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reporterEmail,
      subject: `Street Dog Report Confirmation - ${reportNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
                .ref-number { background: #e8f5e8; padding: 10px; border-left: 4px solid #4CAF50; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>CareTrack - Street Dog Report</h1>
                </div>
                <div class="content">
                    <h2>Hello ${reporterName},</h2>
                    <p>Thank you for reporting the street dog situation. Your report has been successfully received and is now under review.</p>
                    
                    <div class="ref-number">
                        <strong>Reference Number:</strong><br>
                        <h3>${reportNumber}</h3>
                    </div>
                    
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>Our team will review your report within 24-48 hours</li>
                        <li>We may contact you for additional information if needed</li>
                        <li>You can use the reference number above to track the status</li>
                        <li>Our team will take appropriate action based on the situation</li>
                    </ul>
                    
                    <p>If you have any urgent concerns, please contact our helpline.</p>
                    
                    <p>Thank you for helping us make our community safer for everyone!</p>
                </div>
                <div class="footer">
                    <p>CareTrack Street Dog Management System</p>
                    <p>This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${reporterEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  transporter,
  sendReportConfirmationEmail
};