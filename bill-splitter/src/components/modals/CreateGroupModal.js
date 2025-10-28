import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PublicKey } from '@solana/web3.js';

const CreateGroupModal = () => {
  const { isCreateGroupModalOpen, setCreateGroupModalOpen, createGroup, currentUser } = useApp();
  const [groupName, setGroupName] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [category, setCategory] = useState('Other');
  const [members, setMembers] = useState([{ username: '', address: '' }]);
  const [error, setError] = useState('');

  const SOLSPLIT_WALLET_ADDRESS = process.env.REACT_APP_SOLSPLIT_WALLET_ADDRESS;

  const isValidSolanaAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddMember = () => {
    if (members.length < 4) setMembers([...members, { username: '', address: '' }]);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidSolanaAddress(creatorAddress)) {
      setError('Your Solana wallet address is not valid.');
      return;
    }
    for (const member of members) {
      if (!isValidSolanaAddress(member.address)) {
        setError(`The wallet address for "${member.username || 'member'}" is not valid.`);
        return;
      }
    }

    const allAddresses = [creatorAddress, ...members.map(m => m.address)];

    if (allAddresses.some(address => address === SOLSPLIT_WALLET_ADDRESS)) {
      setError("The SolSplit platform wallet cannot be added to a group.");
      return;
    }
    
    const uniqueAddresses = new Set(allAddresses);
    if (uniqueAddresses.size !== allAddresses.length) {
      setError("Duplicate wallet addresses are not allowed in the same group.");
      return;
    }

    const finalMembers = [
      { id: currentUser.username, name: 'You', username: currentUser.username, address: creatorAddress },
      ...members.map((m) => ({ ...m, id: m.username })),
    ];

    const newGroup = { name: groupName, category, members: finalMembers };
    createGroup(newGroup);
    resetAndClose();
  };

  const resetAndClose = () => {
    setGroupName('');
    setCreatorAddress('');
    setCategory('Other');
    setMembers([{ username: '', address: '' }]);
    setError('');
    setCreateGroupModalOpen(false);
  };

  if (!isCreateGroupModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={resetAndClose}>
      <div className="bg-card-bg w-full max-w-sm rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-center mb-6">Create New Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Group Name</label>
            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g., Departmental Dues" className="w-full bg-input-bg rounded-lg p-3" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Your Solana Wallet Address</label>
            <input type="text" value={creatorAddress} onChange={(e) => setCreatorAddress(e.target.value)} placeholder="Enter your wallet address" className="w-full bg-input-bg rounded-lg p-3" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-input-bg rounded-lg p-3">
              <option>Other</option>
              <option>School</option>
              <option>Hostel/Lodge</option>
              <option>Squad</option>
              <option>Trip</option>
              <option>Family</option>
              <option>Friends</option>
              <option>Work</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">Group Members</label>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <input type="text" value={member.username} onChange={(e) => handleMemberChange(index, 'username', e.target.value)} placeholder="Username" className="w-full bg-input-bg rounded-lg p-2 text-sm" required />
                  <input type="text" value={member.address} onChange={(e) => handleMemberChange(index, 'address', e.target.value)} placeholder="Wallet Address" className="w-full bg-input-bg rounded-lg p-2 text-sm" required />
                </div>
              ))}
            </div>
            {members.length < 4 && (
              <button type="button" onClick={handleAddMember} className="text-solana-green text-sm mt-3 font-semibold">
                + Add another member
              </button>
            )}
          </div>
          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={resetAndClose} className="w-full bg-input-bg font-semibold rounded-lg py-3">Cancel</button>
            <button type="submit" className="w-full bg-solana-purple font-semibold rounded-lg py-3">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;