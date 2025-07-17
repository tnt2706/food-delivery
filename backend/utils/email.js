import nodemailer from "nodemailer";
import config from "../config/index.js";

// Create transporter with better configuration
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
      // Additional security options
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    throw new Error("Email service initialization failed");
  }
};

// Validate email parameters
const validateEmailParams = ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error("Recipient email address is required");
  }
  
  if (!subject) {
    throw new Error("Email subject is required");
  }
  
  if (!text && !html) {
    throw new Error("Either text or HTML content is required");
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const recipients = Array.isArray(to) ? to : [to];
  
  for (const email of recipients) {
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }
};

// Validate configuration
const validateConfig = () => {
  if (!config.emailUser) {
    throw new Error("Email user configuration is missing");
  }
  
  if (!config.emailPass) {
    throw new Error("Email password configuration is missing");
  }
};

const sendMail = async ({ to, subject, text, html, attachments = [] }) => {
  try {
    // Validate configuration
    validateConfig();
    
    // Validate input parameters
    validateEmailParams({ to, subject, text, html });
    
    // Create transporter
    const transporter = createTransporter();
    
    // Verify transporter connection
    await transporter.verify();
    
    const mailOptions = {
      from: config.emailUser,
      to,
      subject,
      text,
      html,
      attachments, // Support for attachments
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
    
  } catch (error) {
    console.error("Failed to send email:", error);
    
    // Return structured error response
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
};

// Helper function to send simple text email
export const sendTextEmail = async (to, subject, text) => {
  return await sendMail({ to, subject, text });
};

// Helper function to send HTML email
export const sendHtmlEmail = async (to, subject, html) => {
  return await sendMail({ to, subject, html });
};

// Helper function to send email with both text and HTML
export const sendRichEmail = async (to, subject, text, html) => {
  return await sendMail({ to, subject, text, html });
};

export default sendMail;