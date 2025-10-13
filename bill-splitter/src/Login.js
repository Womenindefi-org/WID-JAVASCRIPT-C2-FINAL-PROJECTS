import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from './context/AppContext';
import AppLogo from './components/common/AppLogo';

const Login = () => {
    const { login, users } = useApp();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        const userExists = users.find(u => u.username === username && u.password === password);
        if (userExists) {
            login(userExists);
            navigate("/dashboard");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        // FIX: Added min-h-screen and flex-col to center the content vertically
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-black p-4">
            <div className="text-center text-white p-6 border border-purple-600 rounded-lg w-full max-w-sm">
                <div className="flex justify-center w-24 h-24 mx-auto mb-4">
                    <AppLogo spinning={false} />
                </div>
                <div className="flex justify-center items-center mb-2">
                    <h1 className="text-5xl font-bold">
                        <span className="text-purple-600">Sol</span>
                        <span className="text-green-600">Split</span>
                    </h1>
                </div>
                <h2 className="text-lg mb-4 italic text-light-gray">Simplify group expenses on Solana</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mb-2 rounded bg-gray-800 text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-800 text-white"
                />

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <button
                    onClick={handleLogin}
                    className="px-4 py-3 bg-purple-500 rounded hover:bg-purple-600 mb-4 w-full font-semibold"
                >
                    Log in
                </button>

                {/* FIX: Corrected alignment for the Sign Up link */}
                <p className="text-sm text-light-gray">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="font-semibold text-solana-purple hover:underline cursor-pointer"
                    >Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;