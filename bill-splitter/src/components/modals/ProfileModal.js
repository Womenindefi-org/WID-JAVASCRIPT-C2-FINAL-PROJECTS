import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';

const ProfileModal = () => {
    const { isProfileModalOpen, setProfileModalOpen, logout, currentUser } = useApp();
    const username = currentUser ? currentUser.username : 'user';

    if (!isProfileModalOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setProfileModalOpen(false)}>
            <div className="bg-card-bg w-11/12 max-w-sm rounded-2xl p-6" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 mb-4">
                        <Avatar seed={username} className="w-20 h-20" />
                    </div>
                    <h1 className="text-xl font-bold">{username}</h1>
                </div>
                <div className="border-t border-input-bg"></div>
                <button onClick={logout} className="w-full bg-danger text-white font-bold py-3 rounded-lg">Disconnect</button>
                <button onClick={() => setProfileModalOpen(false)} className="mt-4 text-light-gray w-full text-center">Close</button>
            </div>
        </div>
    );
};

export default ProfileModal;