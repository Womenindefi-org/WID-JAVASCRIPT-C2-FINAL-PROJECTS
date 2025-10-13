import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from './context/AppContext';

const Register = () => {
    const { registerUser } = useApp();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!username || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        registerUser({ username, password });
        
        setSuccessMessage("Registration successful! Redirecting to login...");

        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };

    return (
        // FIX: Ensured the container is a flex column to center content properly
        <div className="flex flex-col justify-center items-center min-h-screen bg-dark-bg text-white p-4">
            {/* FIX: Removed fixed padding and adjusted width for better responsiveness */}
            <div className="bg-card-bg p-6 sm:p-8 rounded-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                
                {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center mb-4">{error}</p>}
                {successMessage && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-lg text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="w-full p-3 rounded-md bg-input-bg text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full p-3 rounded-md bg-input-bg text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full p-3 rounded-md bg-input-bg text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!!successMessage}
                        className="w-full bg-solana-purple py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed"
                    >
                        {successMessage ? 'Success!' : 'Register'}
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-light-gray">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="font-semibold text-solana-purple hover:underline cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;