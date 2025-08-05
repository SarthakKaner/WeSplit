import React, { useState } from 'react';
import { X, Banknote, FileText, User, Users, Upload, Calendar, Repeat, Clock } from 'lucide-react';
import { useGroups } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import OCRPreviewModal from '../OCR/OCRPreviewModal';

export default function AddExpenseModal({ group, onClose }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitBetween, setSplitBetween] = useState([]);
  const [splitMethod, setSplitMethod] = useState('equal');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [billImage, setBillImage] = useState(null);
  
  // Recurring expense fields
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatCycle, setRepeatCycle] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(group?.id || '');
  const [isActive, setIsActive] = useState(true);
  
  const { addExpense, addRecurringExpense, groups } = useGroups();
  const { user } = useAuth();

  const categories = ['General', 'Food', 'Transportation', 'Accommodation', 'Entertainment', 'Utilities', 'Shopping'];
  const repeatCycles = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Get current group or allow selection if no group specified
  const currentGroup = group || groups.find(g => g.id === selectedGroup);
  const availableGroups = group ? [group] : groups;

  const handleMemberToggle = (memberId) => {
    setSplitBetween(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBillImage(file);
      setShowOCR(true);
    }
  };

  const handleOCRData = (ocrData) => {
    setTitle(ocrData.title || '');
    setAmount(ocrData.total?.toString() || '');
    setShowOCR(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || splitBetween.length === 0 || !currentGroup) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const expenseData = {
        title,
        amount: parseFloat(amount),
        paidBy: paidBy || user.id,
        splitBetween,
        splitMethod,
        category
      };

      if (isRecurring) {
        addRecurringExpense(currentGroup.id, {
          ...expenseData,
          repeatCycle,
          startDate: startDate || new Date().toISOString().split('T')[0],
          isActive
        });
      } else {
        addExpense(currentGroup.id, expenseData);
      }
      
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full w-full max-w-lg">
            <div className="bg-white px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  {isRecurring ? 'Add Recurring Expense' : 'Add New Expense'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Expense Type Toggle */}
                <div className="flex items-center justify-center">
                  <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsRecurring(false)}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        !isRecurring 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      One-time Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRecurring(true)}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        isRecurring 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Repeat className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Recurring Expense
                    </button>
                  </div>
                </div>
                {/* Bill Upload - Only for one-time expenses */}
                {!isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bill Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <label className="cursor-pointer">
                        <span className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                          Upload bill image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        We'll extract expense details automatically
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Expense Title
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Dinner at restaurant"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-2">
                      Paid By
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        id="paidBy"
                        value={paidBy}
                        onChange={(e) => setPaidBy(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select member</option>
                        {currentGroup?.members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Recurring Options */}
                {isRecurring && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Repeat className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">Recurring Settings</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="repeatCycle" className="block text-sm font-medium text-gray-700 mb-2">
                          Repeat Cycle
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            id="repeatCycle"
                            value={repeatCycle}
                            onChange={(e) => setRepeatCycle(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            {repeatCycles.map((cycle) => (
                              <option key={cycle.value} value={cycle.value}>
                                {cycle.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {!group && (
                        <div>
                          <label htmlFor="selectedGroup" className="block text-sm font-medium text-gray-700 mb-2">
                            Group
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              id="selectedGroup"
                              value={selectedGroup}
                              onChange={(e) => setSelectedGroup(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              required
                            >
                              <option value="">Select group</option>
                              {availableGroups.map((grp) => (
                                <option key={grp.id} value={grp.id}>
                                  {grp.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="text-emerald-600 focus:ring-emerald-500 rounded"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Activate recurring expense
                      </label>
                      <span className="text-xs text-gray-500">
                        (You can enable/disable this later)
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Method
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'equal', label: 'Equal Split' },
                      { value: 'unequal', label: 'Unequal Split' },
                      { value: 'percentage', label: 'Percentage' }
                    ].map((method) => (
                      <label key={method.value} className="flex items-center">
                        <input
                          type="radio"
                          value={method.value}
                          checked={splitMethod === method.value}
                          onChange={(e) => setSplitMethod(e.target.value)}
                          className="mr-2 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Split Between
                  </label>
                  <div className="space-y-2">
                    {currentGroup?.members.map((member) => (
                      <label key={member.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={splitBetween.includes(member.id)}
                          onChange={() => handleMemberToggle(member.id)}
                          className="mr-3 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-emerald-700">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !title || !amount || splitBetween.length === 0 || (isRecurring && !selectedGroup && !group)}
                    className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading 
                      ? (isRecurring ? 'Setting up...' : 'Adding...') 
                      : (isRecurring ? 'Create Recurring Expense' : 'Add Expense')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showOCR && billImage && (
        <OCRPreviewModal
          image={billImage}
          onConfirm={handleOCRData}
          onClose={() => setShowOCR(false)}
        />
      )}
    </>
  );
}