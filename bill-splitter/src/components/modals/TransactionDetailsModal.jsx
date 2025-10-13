import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import { QRCodeSVG } from 'qrcode.react';

const TransactionDetailsModal = () => {
    const { isTransactionDetailsModalOpen, setTransactionDetailsModalOpen, activeTransactionDetails, markAsPaid, currentUser, groups, solPrice } = useApp();
    const [qrMember, setQrMember] = useState(null);
    const [copyButtonText, setCopyButtonText] = useState('Copy URL');

    if (!isTransactionDetailsModalOpen || !activeTransactionDetails) return null;

    const SOLSPLIT_WALLET_ADDRESS = process.env.REACT_APP_SOLSPLIT_WALLET_ADDRESS;
    
    const handleMarkAsPaid = (memberUsername) => {
        markAsPaid(activeTransactionDetails.groupName, activeTransactionDetails.id, memberUsername);
    };
    
    const closeModal = () => {
        setTransactionDetailsModalOpen(false);
        setQrMember(null);
    };

    const generateSolanaPayUrl = (amountInUsd) => {
        if (!solPrice) { return "error"; }
        const amountInSol = (amountInUsd / solPrice).toFixed(9);
        const memo = `Payment for ${activeTransactionDetails.description}`;
        const url = new URL(`solana:${SOLSPLIT_WALLET_ADDRESS}`);
        url.searchParams.append("amount", amountInSol);
        url.searchParams.append("cluster", "devnet");
        url.searchParams.append("memo", memo);
        return url.toString();
    };
    
    const generatePhantomPayUrl = (solanaUrl) => {
        if (solanaUrl === "error") return "#";
        const encodedUrl = encodeURIComponent(solanaUrl);
        return `https://phantom.app/ul/v1/pay?request=${encodedUrl}`;
    };

    const handleGetQR = (member) => {
        if (!solPrice) {
            alert("Could not fetch the current price of SOL. Please try again in a moment.");
            return;
        }
        setQrMember(member);
        setCopyButtonText('Copy URL');
    };
    
    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy URL'), 2000);
    };

    const group = groups.find(g => g.name === activeTransactionDetails.groupName);
    const membersWithDetails = group ? group.members : [];

    const allPayers = Object.entries(activeTransactionDetails.splits)
        .filter(([, split]) => split.amount > 0)
        .map(([username, split]) => ({
            username,
            ...split,
            details: membersWithDetails.find(m => m.username === username) || {},
        }));
        
    let solanaUrlForQR, phantomUrlForButton;
    if (qrMember) {
        solanaUrlForQR = generateSolanaPayUrl(qrMember.amount);
        phantomUrlForButton = generatePhantomPayUrl(solanaUrlForQR);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeModal}>
            <div className="bg-card-bg w-11/12 max-w-md rounded-2xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center mb-2">{activeTransactionDetails.description}</h2>
                <p className="text-center text-light-gray text-sm mb-4">Total: ${parseFloat(activeTransactionDetails.totalAmount).toFixed(2)}</p>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {allPayers.map(({ username, amount, status, details }) => (
                        <div key={username} className={`p-3 rounded-lg flex items-center justify-between ${status === 'paid' ? 'bg-green-500/10' : 'bg-input-bg'}`}>
                            <div className="flex items-center">
                                <Avatar seed={details.address || username} className="w-8 h-8 mr-3" />
                                <div>
                                    <p className="font-semibold">{username === currentUser.username ? "You" : username}</p>
                                    <p className={`font-bold ${status === 'paid' ? 'text-solana-green' : 'text-danger'}`}>${amount.toFixed(2)}</p>
                                </div>
                            </div>
                            {status === 'pending' ? (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleGetQR({ ...details, amount, username })} className="bg-solana-purple/50 text-white px-3 py-1 text-xs rounded-md">Get QR</button>
                                    <button onClick={() => handleMarkAsPaid(username)} className="bg-solana-green text-black px-3 py-1 text-xs font-bold rounded-md">Mark Paid</button>
                                </div>
                            ) : ( <span className="text-solana-green font-bold text-sm">PAID ✓</span> )}
                        </div>
                    ))}
                </div>
                <button onClick={closeModal} className="mt-6 w-full bg-input-bg rounded-lg py-3">Close</button>
                {qrMember && (
                    <div className="absolute inset-0 bg-card-bg rounded-2xl flex flex-col items-center justify-center p-4">
                        <h3 className="text-lg font-bold">{qrMember.username === currentUser.username ? "You Owe" : `${qrMember.username} Owes`}</h3>
                        <p className="text-3xl font-bold text-solana-green my-2">${qrMember.amount.toFixed(2)}</p>
                        <p className="text-md text-light-gray font-mono">{solPrice ? `${(qrMember.amount / solPrice).toFixed(6)} SOL` : '...'}</p>
                        <div className="bg-white p-4 rounded-lg inline-block my-4">
                            <QRCodeSVG value={solanaUrlForQR} size={180} />
                        </div>
                        <div className="space-y-2 w-full max-w-xs">
                            <a href={phantomUrlForButton} target="_blank" rel="noopener noreferrer" className="block w-full bg-solana-purple text-white font-semibold py-2 rounded-lg text-sm text-center">
                                Open in Wallet
                            </a>
                            <button onClick={() => handleCopyUrl(phantomUrlForButton)} className="w-full bg-input-bg text-light-gray font-semibold py-2 rounded-lg text-sm">{copyButtonText}</button>
                        </div>
                        <button onClick={() => setQrMember(null)} className="mt-4 w-full max-w-xs text-light-gray text-center">Close QR View</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionDetailsModal; 