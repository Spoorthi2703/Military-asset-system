import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Purchases = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ asset_id: 1, qty: 0 });
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/transactions/history/PURCHASE');
            setHistory(res.data);
        } catch (err) { console.error("History load failed"); }
    };

    useEffect(() => { fetchHistory(); }, []);

    const handlePurchase = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/transactions/purchase', formData);
            if (res.data.success) {
                alert("Stock Successfully Added!");
                fetchHistory(); // Refresh table immediately
            }
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Failed to update SQL"));
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Asset Procurement</h2>
            <form onSubmit={handlePurchase} className="bg-white p-6 shadow-xl rounded-xl border border-gray-200 mb-10">
                <div className="mb-5">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Asset Type</label>
                    <select className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, asset_id: e.target.value})}>
                        <option value="1">M4 Carbine</option>
                        <option value="2">Armored Jeep</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Quantity to Procure</label>
                    <input type="number" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" onChange={e => setFormData({...formData, qty: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-all">Confirm & Update SQL</button>
            </form>

            <h3 className="text-xl font-bold mb-4">Permanent Procurement Log</h3>
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3">Timestamp</th>
                            <th className="p-3">Asset</th>
                            <th className="p-3 text-right">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(row => (
                            <tr key={row.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-sm text-gray-500">{new Date(row.created_at).toLocaleString()}</td>
                                <td className="p-3 font-medium">{row.asset_name}</td>
                                <td className="p-3 text-right font-bold text-blue-600">+{row.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Purchases;