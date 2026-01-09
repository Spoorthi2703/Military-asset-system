import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            !isAuthenticated
              ? <Login setAuth={setIsAuthenticated} />
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout setIsAuthenticated={setIsAuthenticated}>
                <Routes>
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
