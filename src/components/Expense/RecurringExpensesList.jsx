import React, { useState, useEffect } from 'react';
import { Calendar, User, Banknote, Repeat, Clock, Pause, Play, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useGroups } from '../../contexts/GroupContext';
import EditExpenseModal from './EditExpenseModal';

export default function RecurringExpensesList({ groupId, members }) {
  const { recurringExpenses, toggleRecurringExpense, deleteRecurringExpense } = useGroups();
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const groupRecurringExpenses = recurringExpenses.filter(expense => 
    expense.groupId === groupId
  );

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
    return expense.amount / expense.splitBetween.length;
  };

  const handleToggleActive = (recurringId, currentState) => {
    toggleRecurringExpense(recurringId, !currentState);
  };

  const handleEdit = (expense) => {
    setEditingRecurring(expense);
    setOpenDropdown(null);
  };

  const handleDelete = (expense) => {
    setShowDeleteConfirm(expense);
    setOpenDropdown(null);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      // Backend Note: This should send a deletion request to the backend
      deleteRecurringExpense(showDeleteConfirm.id);
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

  if (groupRecurringExpenses.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Repeat className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring expenses</h3>
        <p className="text-gray-500">Set up recurring expenses to automate regular payments.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recurring Expenses</h3>
      
      <div className="space-y-4">
        {groupRecurringExpenses.map((expense) => (
          <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{expense.title}</h4>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    {expense.category}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {expense.repeatCycle}
                  </span>
                  {!expense.isActive && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      Paused
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>Paid by {getMemberName(expense.paidBy)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Next: {formatDate(expense.nextDueDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat className="w-3 h-3" />
                    <span>Every {expense.repeatCycle}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm text-gray-600">
                    Split between: {expense.splitBetween.map(id => getMemberName(id)).join(', ')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ₹{getSplitAmount(expense).toFixed(2)} per person
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-xl font-bold text-gray-900">
                    ₹{expense.amount.toFixed(2)}
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(expense.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
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
                <button
                  onClick={() => handleToggleActive(expense.id, expense.isActive)}
                  className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                    expense.isActive
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {expense.isActive ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingRecurring && (
        <EditExpenseModal
          expense={editingRecurring}
          group={{ id: groupId, members }}
          onClose={() => setEditingRecurring(null)}
          isRecurring={true}
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
                    <h3 className="text-lg font-medium text-gray-900">Delete Recurring Expense</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">{showDeleteConfirm.title}</p>
                  <p className="text-sm text-gray-500">₹{showDeleteConfirm.amount.toFixed(2)} • {showDeleteConfirm.repeatCycle}</p>
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
                    Delete Recurring Expense
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
