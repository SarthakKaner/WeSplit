// WhatsApp Business API Service
// Requires WhatsApp Business account and approved number

export const whatsappService = {
  // WhatsApp Business API configuration
  API_URL: 'https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages',
  ACCESS_TOKEN: 'YOUR_WHATSAPP_BUSINESS_ACCESS_TOKEN',

  // Send WhatsApp message via Business API
  async sendWhatsAppMessage(recipientPhone, message) {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientPhone,
          type: 'text',
          text: {
            body: message
          }
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('WhatsApp send failed:', error);
      return { success: false, error };
    }
  },

  // Send WhatsApp invite
  async sendInvite(recipientPhone, recipientName, groupName, appLink) {
    const message = `Hi ${recipientName}! 👋\n\nYou've been invited to join "${groupName}" on WeSplit.\n\n💰 Split expenses easily with friends in Indian Rupees (₹)\n📱 Track who owes what\n✅ Settle up hassle-free\n\nJoin now: ${appLink}\n\nDownload the app and start splitting! 🎉`;
    
    return await this.sendWhatsAppMessage(recipientPhone, message);
  },

  // Simpler approach: WhatsApp Web/App URL
  openWhatsAppChat(phone, message) {
    // Format phone number (remove spaces, special chars)
    const formattedPhone = phone.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    // Try mobile app first, fallback to web
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile: Try to open WhatsApp app
      window.open(`whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`);
    } else {
      // Desktop: Open WhatsApp Web
      window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`);
    }
  }
};

// Usage:
// whatsappService.openWhatsAppChat('+919876543210', 'Join our group!');
