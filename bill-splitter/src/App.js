import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Login from './Login';
import Register from './Register';
import MainLayout from './components/layout/MainLayout';

function App() {
  const { isLoggedIn } = useApp();

  return (
    <div className="bg-dark-bg text-white font-sans min-h-screen">
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<MainLayout />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;