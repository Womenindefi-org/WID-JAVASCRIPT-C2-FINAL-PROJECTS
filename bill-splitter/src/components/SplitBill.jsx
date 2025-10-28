import React, { useState, useEffect } from "react";
import { useApp } from '../context/AppContext';

const SplitBill = ({ bill, members, onNext }) => {
    const { addExpense, currentUser } = useApp();
    const total = parseFloat(bill.amount) || 0;

    const initialSplits = {};
    if (members.length > 0) {
        members.forEach(member => {
            initialSplits[member.username] = total / members.length;
        });
    }

    const [splits, setSplits] = useState(initialSplits);

    useEffect(() => {
        if (members.length > 0) {
            const updatedSplits = {};
            members.forEach(member => {
                updatedSplits[member.username] = total / members.length;
            });
            setSplits(updatedSplits);
        }
    }, [members, total]);

    const handleChange = (name, value) => {
        if (name === currentUser.username) return; 

        const ownerKey = members.find(m => m.username === currentUser.username)?.username;
        if (!ownerKey) return;

        const currentOwnerAmount = splits[ownerKey];
        const currentValue = splits[name];
        const diff = value - currentValue;

        if (diff > 0 && diff > currentOwnerAmount) {
            value = currentValue + currentOwnerAmount;
        }

        setSplits(prev => ({
            ...prev,
            [name]: value,
            [ownerKey]: prev[ownerKey] - (value - currentValue)
        }));
    };

    const handleConfirm = () => {
        const newExpense = addExpense(bill.group, bill, splits);
        onNext(newExpense);
    };

    if (members.length === 0) {
        return <div className="p-6 text-center">Group has no members. Please add members to the group first.</div>
    }

    return (
        <div className="p-6 animate-[fadeIn_0.4s_ease-out]">
            <h1 className="text-center text-[2.2rem] font-bold">Split Bill</h1>
            <div className="text-center">
              <p className="text-[1.3rem] text-gray-300">Total Bill for {bill.description}</p>
              <p className="text-green-400 text-4xl font-bold">${total.toFixed(2)}</p>
            </div>

            <div className="flex justify-around mt-10 overflow-x-auto pb-4">
              {members.map(member => (
                <div key={member.username} className="flex flex-col items-center mx-2 flex-shrink-0">
                  <input
                      type="range"
                      min="0"
                      max={total}
                      value={splits[member.username] || 0}
                      onChange={(e) => handleChange(member.username, parseFloat(e.target.value))}
                      className="w-16 h-40 rotate-[-90deg] accent-purple-600"
                  />
                  <p className="mt-4 font-medium">${(splits[member.username] || 0).toFixed(2)}</p>
                  <p className="text-gray-300 text-sm capitalize">{member.username === currentUser.username ? 'You' : member.username}</p>
                </div>
              ))}
            </div>

            <button onClick={handleConfirm} className="mt-10 w-full bg-purple-600 py-3 rounded-lg font-medium">
              Confirm Split & Generate QR Codes
            </button>
        </div>
    );
};

export default SplitBill;