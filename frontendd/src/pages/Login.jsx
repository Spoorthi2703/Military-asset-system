import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login for:", credentials.username);
    
    try {
      // 1. Make sure this URL matches your backend exactly!
      const res = await axios.post('http://localhost:5000/api/login', credentials);
      
      console.log("Server Response:", res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role || 'USER');
        
        // 2. Update state and navigate
        setAuth(true);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login Failed Error:", err.response?.data || err.message);
      alert("Unauthorized: Please check Username and Password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-96 border border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-blue-500 text-3xl font-black italic tracking-tighter">MIL-ASSET</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Command Authorization Required</p>
        </div>

        <input 
          type="text" 
          placeholder="Service ID (Username)" 
          className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 transition"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Access Key (Password)" 
          className="w-full p-3 mb-6 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 transition"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95">
          Enter Command Center
        </button>
      </form>
    </div>
  );
}

export default Login;