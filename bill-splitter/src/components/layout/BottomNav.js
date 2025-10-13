import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, ScanIcon, StatsIcon, ProfileIcon, PlusIcon } from '../common/Icons';
import { useApp } from '../../context/AppContext';

const BottomNav = () => {
    const navigate = useNavigate();
    const { setProfileModalOpen } = useApp();

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-dark-bg/80 backdrop-blur-sm z-10 md:hidden">
            <div className="max-w-4xl mx-auto p-4 flex justify-around items-center">
                <NavLink to="." end className={({ isActive }) => `p-2 ${isActive ? 'text-white' : 'text-light-gray'}`}>
                    <HomeIcon />
                </NavLink>
                <button className="p-2 text-light-gray">
                    <ScanIcon />
                </button>
                <button onClick={() => navigate('new-split')} className="bg-solana-purple text-white p-4 rounded-full shadow-lg shadow-solana-purple/30 transform -translate-y-4 hover:scale-110 transition-transform">
                    <PlusIcon />
                </button>
                <NavLink to="stats" className={({ isActive }) => `p-2 ${isActive ? 'text-white' : 'text-light-gray'}`}>
                    <StatsIcon />
                </NavLink>
                <button onClick={() => setProfileModalOpen(true)} className="p-2 text-light-gray">
                    <ProfileIcon />
                </button>
            </div>
        </footer>
    );
};

export default BottomNav;