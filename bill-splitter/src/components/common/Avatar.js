const Avatar = ({ seed, className = "w-10 h-10" }) => {
    const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
    return (
        <div className={`${className} rounded-full bg-card-bg`}>
            <img src={avatarUrl} alt="User Avatar" className="rounded-full" />
        </div>
    );
};
export default Avatar;