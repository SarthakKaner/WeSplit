import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext(undefined);

// Mock data
const mockGroups = [
  {
    id: '1',
    name: 'Weekend Trip',
    description: 'Beach house rental and activities',
    members: [
      { id: '1', name: 'Demo User', email: 'demo@wesplit.com', balance: -2483.00 },
      { id: '2', name: 'Alice Johnson', email: 'alice@example.com', balance: 8741.50 },
      { id: '3', name: 'Bob Smith', email: 'bob@example.com', balance: -6258.50 }
    ],
    expenses: [
      {
        id: '1',
        title: 'Beach House Rental',
        amount: 15000,
        paidBy: '2',
        splitBetween: ['1', '2', '3'],
        splitMethod: 'equal',
        date: '2024-01-15',
        category: 'Accommodation'
      },
      {
        id: '2',
        title: 'Groceries',
        amount: 3775.50,
        paidBy: '1',
        splitBetween: ['1', '2', '3'],
        splitMethod: 'equal',
        date: '2024-01-16',
        category: 'Food'
      }
    ],
    chatMessages: [
      {
        id: '1',
        userId: '2',
        userName: 'Alice Johnson',
        message: 'Thanks for organizing this trip!',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        userId: '1',
        userName: 'Demo User',
        message: 'No problem! Can\'t wait for the weekend.',
        timestamp: '2024-01-15T10:35:00Z'
      }
    ],
    totalBalance: 18775.50,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Roommates',
    description: 'Monthly shared expenses',
    members: [
      { id: '1', name: 'Demo User', email: 'demo@wesplit.com', balance: 1067.09 },
      { id: '7', name: 'Emma Brown', email: 'emma@example.com', balance: 316.84 },
      { id: '8', name: 'John Green', email: 'john@example.com', balance: -1383.91 }
    ],
    expenses: [
      {
        id: '3',
        title: 'Groceries',
        amount: 2499.75,
        paidBy: '7',
        splitBetween: ['1', '7', '8'],
        splitMethod: 'equal',
        date: '2024-01-01',
        category: 'Food'
      },
      {
        id: '4',
        title: 'Electricity Bill',
        amount: 3250.00,
        paidBy: '1',
        splitBetween: ['1', '7', '8'],
        splitMethod: 'equal',
        date: '2024-01-02',
        category: 'Utilities'
      },
      {
        id: '5',
        title: 'Internet Bill',
        amount: 799.00,
        paidBy: '8',
        splitBetween: ['1', '7', '8'],
        splitMethod: 'equal',
        date: '2024-01-03',
        category: 'Utilities'
      }
    ],
    chatMessages: [
      {
        id: '3',
        userId: '7',
        userName: 'Emma Brown',
        message: 'I\'ll pay you back for the utilities tomorrow',
        timestamp: '2024-01-02T14:20:00Z'
      }
    ],
    totalBalance: 6548.75,
    createdAt: '2023-12-01'
  }
];

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [recurringExpenses, setRecurringExpenses] = useState([]);

  const addGroup = (groupData) => {
    const newGroup = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (groupId, updatedGroup) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? updatedGroup : group
    ));
  };

  const addRecurringExpense = (groupId, recurringData) => {
    const newRecurringExpense = {
      ...recurringData,
      id: Date.now().toString(),
      groupId,
      createdAt: new Date().toISOString(),
      nextDueDate: calculateNextDueDate(recurringData.startDate || new Date().toISOString().split('T')[0], recurringData.repeatCycle)
    };

    setRecurringExpenses(prev => [...prev, newRecurringExpense]);
  };

  const calculateNextDueDate = (startDate, repeatCycle) => {
    const date = new Date(startDate);
    const today = new Date();
    
    // If start date is in the future, return start date
    if (date > today) {
      return startDate;
    }
    
    // Calculate next occurrence based on repeat cycle
    switch (repeatCycle) {
      case 'daily':
        date.setDate(today.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(today.getDate() + (7 - today.getDay()) % 7 + 1);
        break;
      case 'monthly':
        date.setMonth(today.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(today.getFullYear() + 1);
        break;
      default:
        date.setMonth(today.getMonth() + 1);
    }
    
    return date.toISOString().split('T')[0];
  };

  const toggleRecurringExpense = (recurringId, isActive) => {
    setRecurringExpenses(prev => prev.map(expense => 
      expense.id === recurringId 
        ? { ...expense, isActive }
        : expense
    ));
  };

  const editExpense = (groupId, expenseId, updatedData) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedGroup = {
          ...group,
          expenses: group.expenses.map(expense => 
            expense.id === expenseId 
              ? { ...expense, ...updatedData, lastModified: new Date().toISOString() }
              : expense
          )
        };
        // Update selected group if it's the current one
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(updatedGroup);
        }
        return updatedGroup;
      }
      return group;
    }));
  };

  const deleteExpense = (groupId, expenseId) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const expenseToDelete = group.expenses.find(e => e.id === expenseId);
        const updatedGroup = {
          ...group,
          expenses: group.expenses.filter(expense => expense.id !== expenseId),
          totalBalance: group.totalBalance - (expenseToDelete?.amount || 0)
        };
        // Update selected group if it's the current one
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(updatedGroup);
        }
        return updatedGroup;
      }
      return group;
    }));
  };

  const editRecurringExpense = (recurringId, updatedData) => {
    setRecurringExpenses(prev => prev.map(expense => 
      expense.id === recurringId 
        ? { 
            ...expense, 
            ...updatedData, 
            lastModified: new Date().toISOString(),
            nextDueDate: updatedData.startDate ? 
              calculateNextDueDate(updatedData.startDate, updatedData.repeatCycle || expense.repeatCycle) : 
              expense.nextDueDate
          }
        : expense
    ));
  };

  const getActiveRecurringExpenses = (groupId) => {
    return recurringExpenses.filter(expense => 
      expense.groupId === groupId && expense.isActive
    );
  };

  const deleteRecurringExpense = (recurringId) => {
    setRecurringExpenses(prev => prev.filter(expense => expense.id !== recurringId));
  };

  const addExpense = (groupId, expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedGroup = {
          ...group,
          expenses: [...group.expenses, newExpense],
          totalBalance: group.totalBalance + expenseData.amount
        };
        // Update selected group if it's the current one
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(updatedGroup);
        }
        return updatedGroup;
      }
      return group;
    }));
  };

  const addChatMessage = (groupId, message, userName, userId) => {
    const newMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      message,
      timestamp: new Date().toISOString()
    };

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedGroup = {
          ...group,
          chatMessages: [...group.chatMessages, newMessage]
        };
        // Update selected group if it's the current one
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(updatedGroup);
        }
        return updatedGroup;
      }
      return group;
    }));
  };

  return (
    <GroupContext.Provider value={{
      groups,
      selectedGroup,
      setSelectedGroup,
      addGroup,
      updateGroup,
      addExpense,
      editExpense,
      deleteExpense,
      addRecurringExpense,
      editRecurringExpense,
      deleteRecurringExpense,
      addChatMessage,
      recurringExpenses,
      toggleRecurringExpense,
      getActiveRecurringExpenses
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
}