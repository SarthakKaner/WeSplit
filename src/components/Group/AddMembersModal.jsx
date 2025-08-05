import React, { useState } from 'react';
import { X, Plus, UserPlus, Mail, MessageSquare, Phone, Share2, ExternalLink } from 'lucide-react';

export default function AddMembersModal({ isOpen, onClose, onAddMember, existingMembers, groupName = "Your Group" }) {
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showInviteOptions, setShowInviteOptions] = useState(false);

  // Mock function to simulate user search
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock users database - in real app, this would be an API call
      const mockUsers = [
        { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: null },
        { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: null },
        { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: null },
        { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: null },
      ];

      // Filter existing members
      const existingMemberIds = existingMembers.map(m => m.id);
      const filteredUsers = mockUsers.filter(user => 
        !existingMemberIds.includes(user.id) &&
        (user.name.toLowerCase().includes(query.toLowerCase()) || 
         user.email.toLowerCase().includes(query.toLowerCase()))
      );

      setSearchResults(filteredUsers);
      setIsSearching(false);
    }, 500);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleAddExistingUser = (user) => {
    onAddMember({
      id: user.id,
      name: user.name,
      email: user.email,
      balance: 0
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleInviteNewUser = () => {
    if (!memberName.trim() || !memberEmail.trim()) {
      alert('Please enter both name and email');
      return;
    }

    // Generate a unique ID for the invited user
    const invitedUser = {
      id: `invited_${Date.now()}`,
      name: memberName.trim(),
      email: memberEmail.trim(),
      phone: memberPhone.trim(),
      balance: 0,
      isInvited: true,
      invitedAt: new Date().toISOString()
    };

    onAddMember(invitedUser);
    
    // Reset form
    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setShowInviteOptions(false);
    
    // Show invite options
    setShowInviteOptions(true);
  };

  const sendInvite = (method, user = null) => {
    const inviteUser = user || { name: memberName, email: memberEmail, phone: memberPhone };
    const appLink = window.location.origin;
    
    switch (method) {
      case 'email':
        // Method 1: Simple mailto (always works)
        const emailSubject = `Join ${groupName} on WeSplit`;
        const emailBody = `Hi ${inviteUser.name},\n\nYou've been invited to join "${groupName}" on our expense splitting app! 💰\n\n✨ Features:\n• Split expenses easily with friends\n• Track who owes what in Indian Rupees (₹)\n• Settle up hassle-free\n\nJoin here: ${appLink}\n\nSee you there! 🎉`;
        
        // Open default email client
        const mailtoLink = `mailto:${inviteUser.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink);
        
        // Option: Add EmailJS for direct sending (requires setup)
        // await emailService.sendInviteEmail(inviteUser.email, inviteUser.name, groupName, 'You');
        break;
        
      case 'whatsapp':
        const whatsappMessage = `Hi ${inviteUser.name}! 👋\n\nYou've been invited to join "${groupName}" on WeSplit.\n\n💰 Split expenses easily in Indian Rupees (₹)\n📱 Track balances\n✅ Settle up quickly\n\nJoin: ${appLink}\n\nLet's start splitting! 🎉`;
        
        // Enhanced WhatsApp support
        const phone = inviteUser.phone || '';
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (phone && phone.trim()) {
          // Send to specific number
          const formattedPhone = phone.replace(/[^\d+]/g, '');
          if (isMobile) {
            window.open(`whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappMessage)}`);
          } else {
            window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappMessage)}`);
          }
        } else {
          // Share via WhatsApp (user chooses recipient)
          if (isMobile) {
            window.open(`whatsapp://send?text=${encodeURIComponent(whatsappMessage)}`);
          } else {
            window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`);
          }
        }
        break;
        
      case 'sms':
        const smsMessage = `Hi ${inviteUser.name}! You've been invited to join "${groupName}" on WeSplit. Join: ${appLink}`;
        
        if (inviteUser.phone && inviteUser.phone.trim()) {
          // Try to open SMS app with pre-filled message
          window.open(`sms:${inviteUser.phone}?body=${encodeURIComponent(smsMessage)}`);
        } else {
          alert('Phone number required for SMS invite');
          return;
        }
        break;
        
      case 'share':
        const shareData = {
          title: `Join ${groupName}`,
          text: `You've been invited to join "${groupName}" on WeSplit - Split expenses easily with friends in Indian Rupees!`,
          url: appLink
        };
        
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          // Use native sharing API (mobile devices)
          navigator.share(shareData).catch(console.error);
        } else {
          // Fallback: Copy to clipboard
          const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareText).then(() => {
              alert('Invite link copied to clipboard! 📋');
            }).catch(() => {
              // Manual copy fallback
              fallbackCopyTextToClipboard(shareText);
            });
          } else {
            fallbackCopyTextToClipboard(shareText);
          }
        }
        break;
    }
    
    // Success message
    const methodNames = {
      email: 'Email',
      whatsapp: 'WhatsApp',
      sms: 'SMS',
      share: 'Share'
    };
    
    setTimeout(() => {
      alert(`✅ ${methodNames[method]} invite opened successfully!`);
    }, 500);
    
    onClose();
  };

  // Fallback copy function for older browsers
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      alert('Invite text copied to clipboard! 📋');
    } catch (err) {
      alert('Please copy this invite text:\n\n' + text);
    }
    
    document.body.removeChild(textArea);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Search Existing Users */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Existing Users
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleAddExistingUser(user)}
                      className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && !isSearching && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No users found. You can invite them below!</p>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Invite New User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Invite New User
            </label>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleInviteNewUser}
            disabled={!memberName.trim() || !memberEmail.trim()}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add & Send Invite</span>
          </button>

          {(showInviteOptions || memberName || memberEmail) && (
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-3">Send invite via:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => sendInvite('email')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Email</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                </button>
                
                <button
                  onClick={() => sendInvite('whatsapp')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="text-sm">WhatsApp</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                </button>
                
                <button
                  onClick={() => sendInvite('sms')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">SMS</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                </button>
                
                <button
                  onClick={() => sendInvite('share')}
                  className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Share2 className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Share</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
              
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Email opens your mail app, WhatsApp opens the app/web, SMS opens messages, Share uses your device's sharing options.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
