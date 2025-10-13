import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Avatar from './common/Avatar';
import { useApp } from '../context/AppContext';

const ConfirmSplitPage = ({ activeBill, group, onDone }) => {
    const navigate = useNavigate();
    const { currentUser, solPrice } = useApp();
    const [selectedMemberForQR, setSelectedMemberForQR] = useState(null);
    const [copyButtonText, setCopyButtonText] = useState('Copy URL');

    const SOLSPLIT_WALLET_ADDRESS = process.env.REACT_APP_SOLSPLIT_WALLET_ADDRESS;

    if (!activeBill || !group) {
        return <div className="p-6 text-center">Loading split details...</div>;
    }

    const generateSolanaPayUrl = (member) => {
        const amountInUsd = activeBill.splits[member.username].amount;
        if (!solPrice) { return "error"; }
        const amountInSol = (amountInUsd / solPrice).toFixed(9);
        const memo = `Payment for ${activeBill.description}`;
        const url = new URL(`solana:${SOLSPLIT_WALLET_ADDRESS}`);
        url.searchParams.append("amount", amountInSol);
        url.searchParams.append("cluster", "devnet");
        url.searchParams.append("label", `SolSplit Payment`);
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
        setSelectedMemberForQR(member);
        setCopyButtonText('Copy URL');
    };
    
    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy URL'), 2000);
    };

    const handleDone = () => {
        onDone();
        navigate('/dashboard');
    };

    const allPayers = group.members.filter(
        member => activeBill.splits[member.username]?.amount > 0
    );

    let solanaUrlForQR, phantomUrlForButton;
    if (selectedMemberForQR) {
        solanaUrlForQR = generateSolanaPayUrl(selectedMemberForQR);
        phantomUrlForButton = generatePhantomPayUrl(solanaUrlForQR);
    }

    return (
        <div className="p-6 animate-[fadeIn_0.4s_ease-out]">
            <h1 className="text-xl font-bold text-center mb-2">Split Confirmed!</h1>
            <p className="text-center text-light-gray mb-6">Click on a member to generate their payment QR code.</p>
            <div className="bg-card-bg p-4 rounded-lg mb-6">
                <p className="text-light-gray">{activeBill.description}</p>
                <p className="text-2xl font-bold text-solana-green">${parseFloat(activeBill.totalAmount).toFixed(2)}</p>
            </div>
            <h2 className="font-semibold mb-3">Total Bill Split:</h2>
            <div className="space-y-3">
                {allPayers.map((member) => (
                    <div key={member.id} onClick={() => handleGetQR(member)} className="flex items-center justify-between bg-input-bg p-3 rounded-lg cursor-pointer hover:bg-solana-purple/20 transition-colors">
                        <div className="flex items-center">
                            <Avatar seed={member.address} className="w-8 h-8 mr-3" />
                            <span>{member.username === currentUser.username ? "You" : member.username}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-danger">${(activeBill.splits[member.username]?.amount || 0).toFixed(2)}</p>
                            <p className="text-xs text-light-gray font-mono">{solPrice ? `${((activeBill.splits[member.username]?.amount || 0) / solPrice).toFixed(6)} SOL` : "..."}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleDone} className="mt-8 w-full bg-solana-purple py-3 rounded-lg font-medium">Done</button>

            {selectedMemberForQR && solanaUrlForQR && solanaUrlForQR !== "error" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedMemberForQR(null)}>
                    <div className="bg-card-bg w-11/12 max-w-xs rounded-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold">{selectedMemberForQR.username === currentUser.username ? "You Owe" : `${selectedMemberForQR.username} Owes`}</h3>
                        <p className="text-3xl font-bold text-solana-green my-2">${(activeBill.splits[selectedMemberForQR.username]?.amount || 0).toFixed(2)}</p>
                        <p className="text-md text-light-gray font-mono">{solPrice ? `${((activeBill.splits[selectedMemberForQR.username]?.amount || 0) / solPrice).toFixed(6)} SOL` : "..."}</p>
                        <div className="bg-white p-4 rounded-lg inline-block my-4">
                            <QRCodeSVG value={solanaUrlForQR} size={200} />
                        </div>
                        <div className="space-y-2">
                            <a href={phantomUrlForButton} target="_blank" rel="noopener noreferrer" className="block w-full bg-solana-purple text-white font-semibold py-2 rounded-lg text-sm">
                                Open in Wallet
                            </a>
                            <button onClick={() => handleCopyUrl(phantomUrlForButton)} className="w-full bg-input-bg text-light-gray font-semibold py-2 rounded-lg text-sm">
                                {copyButtonText}
                            </button>
                        </div>
                        <button onClick={() => setSelectedMemberForQR(null)} className="mt-6 w-full text-light-gray text-center">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmSplitPage; 