const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Email template function for user confirmation
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

// Email template function for admin notification
const sendAdminNotificationEmail = async (reportData) => {
  try {
    const adminEmail = 'wecarea458@gmail.com'; // Admin email address
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Street Dog Report - ${reportData.reportNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 700px; margin: 0 auto; padding: 20px; }
                .header { background: #ff6b35; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
                .alert { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
                .info-box { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .status-badge { display: inline-block; padding: 5px 10px; background: #ff6b35; color: white; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Street Dog Report Received</h1>
                </div>
                <div class="content">
                    <div class="alert">
                        <strong>Action Required:</strong> A new street dog report has been submitted and requires review.
                    </div>
                    
                    <div class="info-box">
                        <h3>Report Details</h3>
                        <p><strong>Report Number:</strong> ${reportData.reportNumber}</p>
                        <p><strong>Location:</strong> ${reportData.reportLocation}</p>
                        <p><strong>Urgency Level:</strong> <span class="status-badge">${reportData.urgencyLevel}</span></p>
                        <p><strong>Dog Count:</strong> ${reportData.dogCount}</p>
                        <p><strong>Condition:</strong> ${reportData.dogCondition}</p>
                        <p><strong>Description:</strong> ${reportData.description}</p>
                    </div>
                    
                    <div class="info-box">
                        <h3>Reporter Information</h3>
                        <p><strong>Name:</strong> ${reportData.reporterName}</p>
                        <p><strong>Email:</strong> ${reportData.reporterEmail}</p>
                        <p><strong>Contact:</strong> ${reportData.reporterContact}</p>
                        <p><strong>Address:</strong> ${reportData.reporterAddress || 'Not provided'}</p>
                    </div>
                    
                    <div class="info-box">
                        <h3>Additional Information</h3>
                        <p><strong>Images:</strong> ${reportData.images?.length || 0} uploaded</p>
                        <p><strong>Videos:</strong> ${reportData.videos?.length || 0} uploaded</p>
                        <p><strong>Additional Notes:</strong> ${reportData.additionalNotes || 'None provided'}</p>
                        <p><strong>Submitted:</strong> ${new Date(reportData.createdAt).toLocaleString()}</p>
                    </div>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Review the report details in the admin dashboard</li>
                        <li>Update the status as you take action</li>
                        <li>Contact the reporter if additional information is needed</li>
                        <li>Coordinate with the rescue team if necessary</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>CareTrack Admin Notification System</p>
                    <p>This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notification email sent for report ${reportData.reportNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending admin email:', error);
    return false;
  }
};

// Email template function for status update notification to user
const sendStatusUpdateEmail = async (reporterEmail, reporterName, reportNumber, oldStatus, newStatus, adminNotes) => {
  try {
    const statusColors = {
      'pending': '#ffc107',
      'under_review': '#17a2b8',
      'rescue_dispatched': '#007bff',
      'rescue_completed': '#28a745',
      'medical_care': '#6f42c1',
      'rehabilitation': '#20c997',
      'released': '#28a745',
      'closed': '#6c757d'
    };

    const statusLabels = {
      'pending': 'Pending',
      'under_review': 'Under Review',
      'rescue_dispatched': 'Rescue Team Dispatched',
      'rescue_completed': 'Rescue Completed',
      'medical_care': 'Under Medical Care',
      'rehabilitation': 'Rehabilitation',
      'released': 'Released',
      'closed': 'Case Closed'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reporterEmail,
      subject: `Report Status Update - ${reportNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
                .status-update { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .status-badge { display: inline-block; padding: 8px 15px; color: white; border-radius: 20px; font-weight: bold; }
                .notes { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Report Status Update</h1>
                </div>
                <div class="content">
                    <h2>Hello ${reporterName},</h2>
                    <p>The status of your street dog report has been updated.</p>
                    
                    <div class="status-update">
                        <h3>Status Change</h3>
                        <p><strong>Report Number:</strong> ${reportNumber}</p>
                        <p><strong>Previous Status:</strong> 
                            <span class="status-badge" style="background: ${statusColors[oldStatus] || '#6c757d'};">
                                ${statusLabels[oldStatus] || oldStatus}
                            </span>
                        </p>
                        <p><strong>New Status:</strong> 
                            <span class="status-badge" style="background: ${statusColors[newStatus] || '#4CAF50'};">
                                ${statusLabels[newStatus] || newStatus}
                            </span>
                        </p>
                    </div>

                    ${adminNotes ? `
                    <div class="notes">
                        <h4>Update from our team:</h4>
                        <p>${adminNotes}</p>
                    </div>
                    ` : ''}

                    <p><strong>What this means:</strong></p>
                    <ul>
                        ${getStatusDescription(newStatus)}
                    </ul>

                    <p>You can always track your report status using your reference number on our website.</p>
                    
                    <p>Thank you for your concern and for helping street dogs in our community!</p>
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
    console.log(`Status update email sent to ${reporterEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    return false;
  }
};

// Helper function to get status descriptions
function getStatusDescription(status) {
  const descriptions = {
    'under_review': '<li>Our team is currently reviewing your report</li><li>We will contact you if we need more information</li>',
    'rescue_dispatched': '<li>Our rescue team has been dispatched to the location</li><li>They will assess the situation and take appropriate action</li>',
    'rescue_completed': '<li>The rescue operation has been completed successfully</li><li>The dogs are now in safe hands</li>',
    'medical_care': '<li>The rescued dogs are receiving medical attention</li><li>Our veterinary team is taking care of their health needs</li>',
    'rehabilitation': '<li>The dogs are undergoing rehabilitation</li><li>They are being prepared for adoption or release</li>',
    'released': '<li>The dogs have been released back to a safe environment</li><li>They are now in a better condition</li>',
    'closed': '<li>This case has been successfully resolved and closed</li><li>Thank you for your contribution to animal welfare</li>'
  };

  return descriptions[status] || '<li>Our team is working on your report</li><li>We appreciate your patience</li>';
}

module.exports = {
  transporter,
  sendReportConfirmationEmail,
  sendAdminNotificationEmail,
  sendStatusUpdateEmail
};