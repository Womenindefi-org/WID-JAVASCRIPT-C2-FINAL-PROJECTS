import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [solPrice, setSolPrice] = useState(null);
  const [balanceVisibility, setBalanceVisibility] = useState({ wallet: true, owes: true, owed: true });
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isGroupDetailsModalOpen, setGroupDetailsModalOpen] = useState(false);
  const [activeGroupDetails, setActiveGroupDetails] = useState(null);
  const [isTransactionDetailsModalOpen, setTransactionDetailsModalOpen] = useState(false);
  const [activeTransactionDetails, setActiveTransactionDetails] = useState(null);

  const MAX_GROUP_MEMBERS = 5;

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        if (data.solana && data.solana.usd) {
          setSolPrice(data.solana.usd);
          console.log(`Current SOL price: $${data.solana.usd}`);
        }
      } catch (error) {
        console.error("Failed to fetch SOL price:", error);
        setSolPrice(150); // Fallback price
      }
    };

    fetchSolPrice();
  }, []);

  const login = (user) => {
    setLoggedIn(true);
    setCurrentUser(user);
  };

  const logout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    setProfileModalOpen(false);
  };

  const registerUser = (user) => setUsers(prev => [...prev, user]);

  const createGroup = (newGroup) => {
    setGroups(prev => [...prev, { ...newGroup, id: Date.now(), expenses: [] }]);
  };

  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const addGroupMember = (groupId, newMember) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId && group.members.length < MAX_GROUP_MEMBERS) {
          return { ...group, members: [...group.members, newMember] };
        }
        return group;
      })
    );
  };

  const deleteGroupMember = (groupId, memberId) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          return { ...group, members: group.members.filter(member => member.id !== memberId) };
        }
        return group;
      })
    );
  };

  useEffect(() => {
    if (activeGroupDetails) {
      const updatedGroup = groups.find(g => g.id === activeGroupDetails.id);
      setActiveGroupDetails(updatedGroup);
    }
  }, [groups, activeGroupDetails]);

  const addExpense = (groupName, bill, splits) => {
    const detailedSplits = Object.keys(splits).reduce((acc, key) => {
      acc[key] = { amount: splits[key], status: 'pending' };
      return acc;
    }, {});

    const newExpense = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      description: bill.description,
      totalAmount: bill.amount,
      paidBy: currentUser.username,
      groupName: groupName,
      splits: detailedSplits,
    };

    setGroups(prev =>
      prev.map(group =>
        group.name === groupName
          ? { ...group, expenses: [...group.expenses, newExpense] }
          : group
      )
    );
    return newExpense;
  };

  const markAsPaid = (groupName, expenseId, memberUsername) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.name === groupName) {
        return {
          ...group,
          expenses: group.expenses.map(expense => {
            if (expense.id === expenseId) {
              const updatedSplits = { ...expense.splits };
              if (updatedSplits[memberUsername]) {
                updatedSplits[memberUsername].status = 'paid';
              }
              return { ...expense, splits: updatedSplits };
            }
            return expense;
          })
        };
      }
      return group;
    }));
  };

  const toggleBalanceVisibility = (key) => setBalanceVisibility(prev => ({ ...prev, [key]: !prev[key] }));

  const value = {
    isLoggedIn, login, logout,
    currentUser,
    users, registerUser,
    groups, createGroup, addExpense, deleteGroup, addGroupMember, deleteGroupMember, markAsPaid, MAX_GROUP_MEMBERS,
    solPrice,
    balanceVisibility, toggleBalanceVisibility,
    isProfileModalOpen, setProfileModalOpen,
    isCreateGroupModalOpen, setCreateGroupModalOpen,
    isGroupDetailsModalOpen, setGroupDetailsModalOpen,
    activeGroupDetails, setActiveGroupDetails,
    isTransactionDetailsModalOpen, setTransactionDetailsModalOpen,
    activeTransactionDetails, setActiveTransactionDetails,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};