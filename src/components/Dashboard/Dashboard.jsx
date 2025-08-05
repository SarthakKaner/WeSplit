import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGroups } from '../../contexts/GroupContext';
import { BarChart, DonutChart } from './Charts';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Calendar,
  ArrowRight,
  Banknote,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { groups } = useGroups();
  const navigate = useNavigate();

  // Calculate dashboard statistics
  const totalGroups = groups.length;
  const totalMembers = groups.reduce((total, group) => total + group.members.length, 0);
  const totalExpenses = groups.reduce((total, group) => total + group.expenses.length, 0);
  const totalAmount = groups.reduce((total, group) => total + group.totalBalance, 0);
  
  // Calculate user's total members across all groups
  const userGroupsCount = groups.filter(group => 
    group.members.some(member => member.id === user?.id)
  ).length;

  // Recent activity (last 5 expenses across all groups)
  const recentExpenses = groups
    .flatMap(group => 
      group.expenses.map(expense => ({
        ...expense,
        groupName: group.name,
        groupId: group.id
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Expense by category data
  const expensesByCategory = groups
    .flatMap(group => group.expenses)
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

  const categoryChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ label: category, value: amount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Monthly spending trend (last 6 months) - Mock data for demonstration
  const monthlySpending = [
    { label: 'Mar', value: 12500 },
    { label: 'Apr', value: 18700 },
    { label: 'May', value: 15200 },
    { label: 'Jun', value: 22300 },
    { label: 'Jul', value: 19800 },
    { label: 'Aug', value: totalAmount > 0 ? totalAmount : 16500 }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-sm sm:text-base text-emerald-100">
              Here's your expense overview and recent activity.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/create-group')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-600 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create Group
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalGroups}</p>
              <p className="text-xs sm:text-sm text-gray-600">Groups</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalExpenses}</p>
              <p className="text-xs sm:text-sm text-gray-600">Expenses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(0)}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalMembers}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Monthly Spending</h3>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <BarChart data={monthlySpending} />
        </div>

        {/* Expense by Category */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Spending by Category</h3>
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          {categoryChartData.length > 0 ? (
            <DonutChart data={categoryChartData} />
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Expenses */}
        <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button
              onClick={() => navigate('/groups')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
            </button>
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{expense.title}</p>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{expense.groupName}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent expenses</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/create-group')}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Create Group</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
            
            <button
              onClick={() => navigate('/groups')}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">View Groups</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">My Profile</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}