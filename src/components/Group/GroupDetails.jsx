import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Banknote, MessageCircle } from 'lucide-react';
import { useGroups } from '../../contexts/GroupContext';
import ExpenseList from '../Expense/ExpenseList';
import ChatSection from '../Chat/ChatSection';
import MembersList from './MembersList';
import AddExpenseModal from '../Expense/AddExpenseModal';

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, setSelectedGroup, selectedGroup, updateGroup } = useGroups();
  const [activeTab, setActiveTab] = useState('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    if (id) {
      const group = groups.find(g => g.id === id);
      setSelectedGroup(group || null);
    }
  }, [id, groups, setSelectedGroup]);

  const handleAddMember = (newMember) => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        members: [...selectedGroup.members, newMember]
      };
      setSelectedGroup(updatedGroup);
      updateGroup(selectedGroup.id, updatedGroup);
    }
  };

  if (!selectedGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'expenses', label: 'Expenses', icon: Banknote },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users },
  ];

  const getUserBalance = () => {
    const currentUser = selectedGroup.members.find(member => member.id === '1');
    return currentUser?.balance || 0;
  };

  const userBalance = getUserBalance();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{selectedGroup.name}</h1>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{selectedGroup.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
              <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">Total Expenses</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{selectedGroup.totalBalance.toFixed(2)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">Members</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {selectedGroup.members.length}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Your Balance</span>
            </div>
            <span className={`text-lg sm:text-xl font-bold ${
              userBalance > 0 
                ? 'text-green-600' 
                : userBalance < 0 
                  ? 'text-red-600' 
                  : 'text-gray-900'
            }`}>
              {userBalance > 0 ? '+' : ''}₹{userBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:mt-6 space-y-3 sm:space-y-0">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'expenses' && (
            <button
              onClick={() => setShowAddExpense(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Add Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
        {activeTab === 'expenses' && <ExpenseList expenses={selectedGroup.expenses} members={selectedGroup.members} groupId={selectedGroup.id} />}
        {activeTab === 'chat' && <ChatSection group={selectedGroup} />}
        {activeTab === 'members' && <MembersList members={selectedGroup.members} onAddMember={handleAddMember} groupName={selectedGroup.name} />}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          group={selectedGroup}
          onClose={() => setShowAddExpense(false)}
        />
      )}
    </div>
  );
}