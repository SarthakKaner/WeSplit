import React, { useState, useEffect } from 'react';
import { Calendar, User, Banknote, Tag, Repeat, List, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useGroups } from '../../contexts/GroupContext';
import RecurringExpensesList from './RecurringExpensesList';
import EditExpenseModal from './EditExpenseModal';

export default function ExpenseList({ expenses, members, groupId }) {
  const [activeTab, setActiveTab] = useState('regular');
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const { deleteExpense } = useGroups();
  const getMemberName = (memberId) => {
    return members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSplitAmount = (expense) => {
    if (expense.splitMethod === 'equal') {
      return expense.amount / expense.splitBetween.length;
    }
    // For unequal and percentage splits, we'd calculate based on splitData
    return expense.amount / expense.splitBetween.length;
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setOpenDropdown(null);
  };

  const handleDelete = (expense) => {
    setShowDeleteConfirm(expense);
    setOpenDropdown(null);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      // Backend Note: This should send a deletion request to the backend
      // and handle member approval workflow if required
      deleteExpense(groupId, showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    }
  };

  const toggleDropdown = (expenseId) => {
    setOpenDropdown(openDropdown === expenseId ? null : expenseId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  if (expenses.length === 0 && activeTab === 'regular') {
    return (
      <div className="p-6 sm:p-8 lg:p-12 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Banknote className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">Add your first expense to get started with splitting costs.</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('regular')}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'regular' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Regular</span>
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'recurring' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Recurring</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'regular' ? (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recent Expenses</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{expense.title}</h4>
                      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full whitespace-nowrap">
                          {expense.category}
                        </span>
                        {expense.lastModified && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                            Edited
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Paid by {getMemberName(expense.paidBy)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{formatDate(expense.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 flex-shrink-0" />
                        <span>Split {expense.splitMethod}</span>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-3">
                      <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        Split between: {expense.splitBetween.map(id => getMemberName(id)).join(', ')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        ₹{getSplitAmount(expense).toFixed(2)} per person
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right mt-3 sm:mt-0 sm:ml-4">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      ₹{expense.amount.toFixed(2)}
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(expense.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openDropdown === expense.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(expense);
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(expense);
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <RecurringExpensesList groupId={groupId} members={members} />
      )}

      {/* Edit Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          group={{ id: groupId, members }}
          onClose={() => setEditingExpense(null)}
          isRecurring={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteConfirm(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Delete Expense</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">{showDeleteConfirm.title}</p>
                  <p className="text-sm text-gray-500">₹{showDeleteConfirm.amount.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                  >
                    Delete Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}