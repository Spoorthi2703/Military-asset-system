import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const Transfers = () => {
    const navigate = useNavigate();
    const [transfer, setTransfer] = useState({ asset_id: 1, from_base_id: 1, to_base_id: 2, qty: 0 });
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/transactions/history/TRANSFER`);
        setHistory(res.data);
    } catch (err) { 
        console.error("History load failed"); 
    }
};

useEffect(() => { 
    fetchHistory(); 
}, []);

const handleTransfer = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${API_BASE_URL}/transactions/transfer`, transfer);
        if (res.data.success) {
            alert(`Transfer Successful!`);
            fetchHistory();
        }
    } catch (err) { 
        alert("Transfer Failed"); 
    }
};
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Inter-Base Asset Transfer</h1>
            <form onSubmit={handleTransfer} className="bg-white p-8 rounded-lg shadow-md border space-y-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Source Base</label>
                        <select className="w-full border p-2 rounded" onChange={(e) => setTransfer({...transfer, from_base_id: e.target.value})}>
                            <option value="1">Base Alpha (Central Command)</option>
                            <option value="2">Base Bravo (Southern Command)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Destination Base</label>
                        <select className="w-full border p-2 rounded" onChange={(e) => setTransfer({...transfer, to_base_id: e.target.value})}>
                            <option value="2">Base Bravo (Southern Command)</option>
                            <option value="1">Base Alpha (Central Command)</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Asset Type</label>
                        <select className="w-full border p-2 rounded" onChange={(e) => setTransfer({...transfer, asset_id: e.target.value})}>
                            <option value="1">M4 Carbine</option>
                            <option value="2">Armored Jeep</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quantity</label>
                        <input type="number" placeholder="0" className="w-full border p-2 rounded" onChange={(e) => setTransfer({...transfer, qty: parseInt(e.target.value)})} required />
                    </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800">Execute</button>
            </form>

            <h3 className="text-xl font-bold mb-4">Permanent Transfer History</h3>
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-sm">
                        <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Asset</th>
                            <th className="p-3">From</th>
                            <th className="p-3">To</th>
                            <th className="p-3 text-right">Qty</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {history.map(row => (
                            <tr key={row.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{new Date(row.created_at).toLocaleDateString()}</td>
                                <td className="p-3 font-bold">{row.asset_name}</td>
                                <td className="p-3 text-gray-500">Base {row.from_base_id}</td>
                                <td className="p-3 text-gray-500">Base {row.to_base_id}</td>
                                <td className="p-3 text-right font-bold">-{row.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transfers;
