import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Login from './pages/Login';

function App() {
  // Instead of just a raw state, use this to ensure it stays in sync
const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
});
  return (
    <Router>
      <Routes>
        {/* If NOT logged in, any path will take them to Login */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/purchases" element={<Purchases />} />
                  <Route path="/transfers" element={<Transfers />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;