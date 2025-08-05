// SMS Service options

export const smsService = {
  // Method 1: Browser SMS scheme (Limited)
  openSMSApp(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    window.open(`sms:${phone}?body=${encodedMessage}`);
  },

  // Method 2: Twilio SMS API (Backend required)
  async sendSMSViaTwilio(phone, message) {
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: message
        })
      });

      return await response.json();
    } catch (error) {
      console.error('SMS send failed:', error);
      return { success: false, error };
    }
  },

  // Method 3: Alternative SMS services
  async sendSMSViaService(phone, message, service = 'twilio') {
    const smsData = {
      phone,
      message,
      service
    };

    // Different SMS service providers
    const providers = {
      twilio: '/api/sms/twilio',
      messagebird: '/api/sms/messagebird',
      nexmo: '/api/sms/nexmo'
    };

    try {
      const response = await fetch(providers[service] || providers.twilio, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData)
      });

      return await response.json();
    } catch (error) {
      console.error(`${service} SMS failed:`, error);
      return { success: false, error };
    }
  }
};
