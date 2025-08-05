import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Banknote, Calendar } from 'lucide-react';

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getUserBalance = () => {
    // In a real app, this would calculate the current user's balance
    const currentUser = group.members.find(member => member.id === '1'); // Demo user ID
    return currentUser?.balance || 0;
  };

  const userBalance = getUserBalance();

  return (
    <div 
      onClick={() => navigate(`/group/${group.id}`)}
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate group-hover:text-emerald-600 transition-colors">
            {group.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {group.description}
          </p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">
              {formatDate(group.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 sm:pt-3 border-t border-gray-100 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Banknote className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600">Total expenses</span>
          </div>
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            ₹{group.totalBalance.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-600">Your balance</span>
          <span className={`text-sm sm:text-base font-semibold ${
            userBalance > 0 
              ? 'text-green-600' 
              : userBalance < 0 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {userBalance > 0 ? '+' : ''}₹{userBalance.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="flex -space-x-1 sm:-space-x-2">
          {group.members.slice(0, 4).map((member, index) => (
            <div
              key={member.id}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-white text-emerald-700 hover:z-10 transition-transform hover:scale-110"
              title={member.name}
            >
              <span className="text-xs sm:text-xs font-medium">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
          ))}
          {group.members.length > 4 && (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs font-medium text-gray-600">
                +{group.members.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}