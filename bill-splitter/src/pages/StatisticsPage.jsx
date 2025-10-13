import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const StatisticsPage = () => {
    const { groups } = useApp();
    const [visibleCount, setVisibleCount] = useState(15);
    const [timeframe, setTimeframe] = useState('weekly');

    const { chartData, allTransactions } = useMemo(() => {
        const transactions = groups
            .flatMap(group => group.expenses.map(expense => ({ ...expense, groupName: group.name })))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        let processedChartData = [];
        let totals = {};

        switch (timeframe) {
            case 'daily':
                totals = transactions.reduce((acc, tx) => {
                    const date = new Date(tx.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format for sorting
                    acc[date] = (acc[date] || 0) + parseFloat(tx.totalAmount);
                    return acc;
                }, {});
                processedChartData = Object.keys(totals)
                    .sort() // Sort dates chronologically
                    .map(date => ({ 
                        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                        amount: totals[date] 
                    }));
                break;

            case 'weekly':
                totals = transactions.reduce((acc, tx) => {
                    const txDate = new Date(tx.date);
                    const dayOfWeek = txDate.getDay();
                    const startOfWeek = new Date(txDate.setDate(txDate.getDate() - dayOfWeek));
                    const weekKey = startOfWeek.toLocaleDateString('en-CA'); // YYYY-MM-DD format
                    
                    acc[weekKey] = (acc[weekKey] || 0) + parseFloat(tx.totalAmount);
                    return acc;
                }, {});
                processedChartData = Object.keys(totals)
                    .sort()
                    .map(weekKey => ({
                        label: `Week of ${new Date(weekKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                        amount: totals[weekKey]
                    }));
                break;

            case 'monthly':
                totals = transactions.reduce((acc, tx) => {
                    const monthKey = new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                    acc[monthKey] = (acc[monthKey] || 0) + parseFloat(tx.totalAmount);
                    return acc;
                }, {});
                processedChartData = Object.keys(totals)
                    .sort((a, b) => new Date(a) - new Date(b)) // Sort months chronologically
                    .map(monthKey => ({
                        label: monthKey,
                        amount: totals[monthKey]
                    }));
                break;
            default:
                break;
        }

        return { chartData: processedChartData, allTransactions: transactions };
    }, [groups, timeframe]); // Re-calculate when timeframe changes

    const handleLoadMore = () => {
        setVisibleCount(allTransactions.length);
    };

    return (
        <div className="animate-[fadeIn_0.4s_ease-out] p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Spending Statistics</h1>
                <div className="flex space-x-2 bg-card-bg p-1 rounded-lg">
                    <button onClick={() => setTimeframe('daily')} className={`px-3 py-1 text-sm rounded-md ${timeframe === 'daily' ? 'bg-solana-purple text-white' : 'text-light-gray'}`}>Daily</button>
                    <button onClick={() => setTimeframe('weekly')} className={`px-3 py-1 text-sm rounded-md ${timeframe === 'weekly' ? 'bg-solana-purple text-white' : 'text-light-gray'}`}>Weekly</button>
                    <button onClick={() => setTimeframe('monthly')} className={`px-3 py-1 text-sm rounded-md ${timeframe === 'monthly' ? 'bg-solana-purple text-white' : 'text-light-gray'}`}>Monthly</button>
                </div>
            </div>

            <div className="bg-card-bg p-4 rounded-lg mb-8 h-72">
                <h2 className="font-semibold text-light-gray mb-2">
                    {`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Spending`}
                </h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="label" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                                cursor={{ fill: 'rgba(128, 90, 213, 0.1)' }}
                                labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="amount" fill="#805AD5" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-light-gray">
                        No transaction data for this timeframe.
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Full History</h2>
                <div className="space-y-3">
                    {allTransactions.length > 0 ? (
                        allTransactions.slice(0, visibleCount).map(tx => (
                            <div key={tx.id} className="bg-card-bg p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{tx.description}</p>
                                    <p className="text-sm text-light-gray">{tx.groupName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${parseFloat(tx.totalAmount).toFixed(2)}</p>
                                    <p className="text-xs text-light-gray">{tx.date}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-light-gray">No transactions have been recorded yet.</p>
                    )}
                </div>
                {allTransactions.length > visibleCount && (
                    <button 
                        onClick={handleLoadMore} 
                        className="w-full mt-6 bg-solana-purple/50 text-white font-semibold py-2 rounded-lg hover:bg-solana-purple/80 transition-colors"
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default StatisticsPage;