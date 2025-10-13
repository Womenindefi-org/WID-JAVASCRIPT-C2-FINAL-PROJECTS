import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';

const Header = () => {
  const { setProfileModalOpen, currentUser } = useApp();
  const username = currentUser ? currentUser.username : 'user';

  return (
    <header className="p-6 hidden md:flex justify-end items-center">
        <button 
            onClick={() => setProfileModalOpen(true)} 
            className="flex items-center space-x-3 text-white font-semibold p-2 rounded-lg hover:bg-card-bg transition-colors"
        >
            <span>{`${username}.sol`}</span>
            <Avatar seed={username} className="w-10 h-10" />
        </button>
    </header>
  );
};

export default Header;