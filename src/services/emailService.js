// Email Service using EmailJS (Free service)
// Install: npm install @emailjs/browser

import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAIL_SERVICE_ID = 'your_service_id'; // From EmailJS dashboard
const EMAIL_TEMPLATE_ID = 'your_template_id'; // From EmailJS dashboard
const EMAIL_PUBLIC_KEY = 'your_public_key'; // From EmailJS dashboard

export const emailService = {
  // Initialize EmailJS
  init() {
    emailjs.init(EMAIL_PUBLIC_KEY);
  },

  // Send invitation email
  async sendInviteEmail(recipientEmail, recipientName, groupName, senderName) {
    try {
      const templateParams = {
        to_email: recipientEmail,
        to_name: recipientName,
        group_name: groupName,
        sender_name: senderName,
        app_link: window.location.origin,
        subject: `Join ${groupName} on WeSplit`
      };

      const response = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
      console.error('Email send failed:', error);
      return { success: false, message: 'Failed to send email' };
    }
  },

  // Alternative: Using fetch to backend API
  async sendEmailViaBackend(inviteData) {
    try {
      const response = await fetch('/api/send-invite-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Backend email failed:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }
};

// Usage example:
// emailService.init();
// await emailService.sendInviteEmail('user@example.com', 'John', 'Trip Group', 'You');
