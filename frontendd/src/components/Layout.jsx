import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('role');
    
    
    setIsAuthenticated(false);
    
    
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold border-b border-slate-700 pb-2">MIL-ASSET v1.0</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="block p-3 rounded hover:bg-slate-800 transition">Dashboard</Link>
          <Link to="/purchases" className="block p-3 rounded hover:bg-slate-800 transition">Purchases</Link>
          <Link to="/transfers" className="block p-3 rounded hover:bg-slate-800 transition">Transfers</Link>
          <Link to="/assignments" className="block p-3 rounded hover:bg-slate-800 transition">Assignments</Link>
        </nav>

        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout Session
          </button>
        </div>
      </div>

      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <span className="text-gray-500 font-medium italic">Security Status: Encrypted</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase">
            Role: {localStorage.getItem('role') || 'User'}
          </span>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
