import React, { useState } from 'react';
import { User, Mail, UserPlus } from 'lucide-react';
import AddMembersModal from './AddMembersModal';

export default function MembersList({ members, onAddMember, groupName }) {
  const [showAddMembers, setShowAddMembers] = useState(false);

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Group Members</h3>
        <button
          onClick={() => setShowAddMembers(true)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Members</span>
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{member.name}</h4>
                  {member.isInvited && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Invited
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Balance</div>
              <div className={`text-sm sm:text-base font-semibold ${
                member.balance > 0 
                  ? 'text-green-600' 
                  : member.balance < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {member.balance > 0 ? '+' : ''}₹{member.balance.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2">Balance Summary</h4>
        <p className="text-xs sm:text-sm text-blue-700">
          Positive balances indicate money owed to you. Negative balances show money you owe to the group.
        </p>
      </div>

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddMembers}
        onClose={() => setShowAddMembers(false)}
        onAddMember={onAddMember}
        existingMembers={members}
        groupName={groupName}
      />
    </div>
  );
}