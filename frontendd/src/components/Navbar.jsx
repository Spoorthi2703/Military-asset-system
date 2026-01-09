import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Purchases', path: '/purchases' },
    { name: 'Transfers', path: '/transfers' },
    { name: 'Assignments', path: '/assignments' },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <span className="text-xl font-bold tracking-tighter text-blue-400">MIL-ASSET v1.0</span>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path ? 'bg-slate-700 text-blue-300' : 'hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">ROLE: ADMIN</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;