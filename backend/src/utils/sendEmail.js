import nodemailer from 'nodemailer';

/**
 * Sends an email
 * @param {Object} options
 * @param {string} options.to - Receiver email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {Buffer} [options.pdfBuffer] - Optional PDF attachment
 * @param {string} [options.filename] - PDF filename
 */
const sendEmail = async ({ to, subject, text, pdfBuffer, filename }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: `"CareCircle" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    // Attach PDF if provided
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: filename || 'report.pdf',
          content: pdfBuffer
        }
      ];
    }

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export default sendEmail;