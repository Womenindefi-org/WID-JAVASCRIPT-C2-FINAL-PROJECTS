import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import DashboardPage from '../../pages/DashboardPage';
import ProfileModal from '../modals/ProfileModal';
import CreateGroupModal from '../modals/CreateGroupModal';
import GroupDetailsModal from '../modals/GroupDetailsModal';
import TransactionDetailsModal from '../modals/TransactionDetailsModal';
import AddBillEmpty from '../AddBillEmpty';
import SplitBill from '../SplitBill';
import ConfirmSplitPage from '../ConfirmSplitPage';
import InsightsPage from '../../pages/InsightsPage';
import StatisticsPage from '../../pages/StatisticsPage';

const MainLayout = () => {
  const { groups } = useApp();

  const [bill, setBill] = useState({ description: '', amount: '', group: '' });
  const [screen, setScreen] = useState(1);
  const [activeBill, setActiveBill] = useState(null);

  const resetSplitFlow = () => {
    setBill({ description: '', amount: '', group: '' });
    setActiveBill(null);
    setScreen(1);
  };

  const renderNewSplitContent = () => {
    switch (screen) {
      case 1:
        return (
          <AddBillEmpty
            bill={bill}
            setBill={setBill}
            onNext={() => setScreen(2)}
            groups={groups}
          />
        );
      case 2:
        return (
          <SplitBill
            bill={bill}
            members={groups.find((g) => g.name === bill.group)?.members || []}
            onNext={(finalBill) => {
              setActiveBill(finalBill);
              setScreen(3);
            }}
          />
        );
      case 3:
        return (
          <ConfirmSplitPage
            activeBill={activeBill}
            group={groups.find((g) => g.name === bill.group)}
            onDone={resetSplitFlow}
          />
        );
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <>
      <div className="md:flex">
        <Sidebar onNewSplitClick={resetSplitFlow} />
        <main className="flex-1 md:ml-64 bg-dark-bg min-h-screen">
          <Header />
          <div className="max-w-4xl mx-auto p-4 md:p-6 pb-28 md:pb-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/new-split" element={renderNewSplitContent()} />
            </Routes>
          </div>
        </main>
        <BottomNav />
      </div>
      <ProfileModal />
      <CreateGroupModal />
      <GroupDetailsModal />
      <TransactionDetailsModal />
    </>
  );
};

export default MainLayout;