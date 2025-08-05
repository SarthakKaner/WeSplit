import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../../contexts/GroupContext';
import GroupCard from './GroupCard';
import { Plus, Users, Search } from 'lucide-react';

export default function GroupsPage() {
  const { groups } = useGroups();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              My Groups
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your expense groups and view group details.
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/create-group')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create New Group
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {groups.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Groups Grid */}
      <div>
        {groups.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8 lg:p-12 border border-gray-200 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto">
              Create your first group to start splitting expenses with friends and family.
            </p>
            <button
              onClick={() => navigate('/create-group')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create Your First Group
            </button>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-sm sm:text-base text-gray-500">
              Try adjusting your search terms or create a new group.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>

      {/* Groups Statistics */}
      {groups.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Groups Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-600">{groups.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Groups</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {groups.reduce((total, group) => total + group.members.length, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Members</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {groups.reduce((total, group) => total + group.expenses.length, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Expenses</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-orange-600">
                ₹{groups.reduce((total, group) => total + group.totalBalance, 0).toFixed(2)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
