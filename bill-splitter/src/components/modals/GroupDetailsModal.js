import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';

const GroupDetailsModal = () => {
    const { 
        isGroupDetailsModalOpen, 
        setGroupDetailsModalOpen, 
        activeGroupDetails, 
        deleteGroupMember,
        addGroupMember,
        currentUser,
        MAX_GROUP_MEMBERS
    } = useApp();
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState('');
    const [newMemberAddress, setNewMemberAddress] = useState('');
    const [error, setError] = useState('');

    if (!isGroupDetailsModalOpen || !activeGroupDetails) return null;

    const truncateAddress = (address) => {
        if (!address || address.length <= 10) return address;
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    const handleDelete = (memberId) => {
        // Using a custom UI alert/modal here would be a future enhancement
        if (window.confirm("Are you sure you want to remove this member?")) {
            deleteGroupMember(activeGroupDetails.id, memberId);
        }
    };

    const handleAdd = () => {
        setError('');
        if (!newMemberUsername || !newMemberAddress) {
            setError("Username and address are required.");
            return;
        }
        if (newMemberAddress.length <= 25) {
            setError("Wallet address must be more than 25 characters.");
            return;
        }

        const newMember = {
            id: newMemberUsername,
            username: newMemberUsername,
            address: newMemberAddress,
        };

        addGroupMember(activeGroupDetails.id, newMember);
        
        setNewMemberUsername('');
        setNewMemberAddress('');
        setShowAddForm(false);
        setError('');
    };
    
    const closeModal = () => {
        setGroupDetailsModalOpen(false);
        setShowAddForm(false);
        setError('');
    };

    const isBelowMaxMembers = activeGroupDetails.members.length < MAX_GROUP_MEMBERS;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeModal}>
            <div className="bg-card-bg w-11/12 max-w-md rounded-2xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center mb-1">{activeGroupDetails.name}</h2>
                <p className="text-sm text-light-gray text-center mb-6">
                    {activeGroupDetails.members.length} / {MAX_GROUP_MEMBERS} members
                </p>

                <div className="space-y-3">
                    {activeGroupDetails.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-input-bg p-2 rounded-lg">
                           <div className="flex items-center overflow-hidden">
                                <Avatar seed={member.address} className="w-10 h-10 mr-3 flex-shrink-0" />
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate">{member.username === currentUser.username ? "You" : member.username}</p>
                                    <p className="text-xs text-light-gray font-mono truncate">{truncateAddress(member.address)}</p>
                                </div>
                           </div>
                           {member.username !== currentUser.username && (
                               <button onClick={() => handleDelete(member.id)} className="text-danger text-2xl font-bold px-2 flex-shrink-0">&times;</button>
                           )}
                        </div>
                    ))}
                </div>

                {showAddForm && (
                    <div className="mt-4 border-t border-input-bg pt-4">
                        <h3 className="font-semibold mb-2">Add New Member</h3>
                        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Username"
                                value={newMemberUsername}
                                onChange={(e) => setNewMemberUsername(e.target.value)}
                                className="w-full bg-input-bg rounded-lg p-2 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Wallet Address"
                                value={newMemberAddress}
                                onChange={(e) => setNewMemberAddress(e.target.value)}
                                className="w-full bg-input-bg rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div className="flex space-x-2 mt-3">
                            <button onClick={() => setShowAddForm(false)} className="w-full bg-light-gray/20 rounded-lg py-2 text-sm">Cancel</button>
                            <button onClick={handleAdd} className="w-full bg-solana-green text-black rounded-lg py-2 text-sm font-bold">Confirm</button>
                        </div>
                    </div>
                )}
                
                {!showAddForm && (
                     <div className="flex space-x-2 mt-6">
                        <button onClick={closeModal} className="w-full bg-input-bg rounded-lg py-3">Close</button>
                        {isBelowMaxMembers && (
                            <button onClick={() => setShowAddForm(true)} className="w-full bg-solana-purple rounded-lg py-3">Add Member</button>
                        )}
                    </div>
                )}
            </div>
        </div> 
    );
};

export default GroupDetailsModal;