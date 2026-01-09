import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Assignments = () => {
    const [data, setData] = useState({ asset_id: 1, personnel_name: '', qty: 0 });
    const [assignHistory, setAssignHistory] = useState([]);
    const [expendHistory, setExpendHistory] = useState([]);

    const fetchHistories = async () => {
    try {
        // Fetch Assignment History
        const resAssign = await axios.get(`${API_BASE_URL}/transactions/history/ASSIGNMENT`);
        setAssignHistory(resAssign.data);

        // Fetch Expenditure History
        const resExpend = await axios.get(`${API_BASE_URL}/transactions/history/EXPENDITURE`);
        setExpendHistory(resExpend.data);
    } catch (err) {
        console.error("History load failed", err);
    }
};

useEffect(() => {
    fetchHistories();
}, []);

const submitLog = async (type) => {
    if (data.qty <= 0) return alert("Please enter a valid quantity");
    try {
        const res = await axios.post(`${API_BASE_URL}/transactions/assign`, { ...data, type });
        if (res.data.success) {
            alert(`${type} logged successfully!`);
            fetchHistories(); // Refresh both tables
        }
    } catch (err) {
        alert("Error logging " + type);
    }
};

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Assignments & Expenditure</h1>
            
            {/* FORM CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded shadow border">
                    <h2 className="font-bold text-lg mb-4 text-orange-600">Assign Asset to Personnel</h2>
                    <select className="w-full p-2 border mb-4 rounded" onChange={e => setData({...data, asset_id: e.target.value})}>
                        <option value="1">M4 Carbine</option>
                        <option value="2">Armored Jeep</option>
                    </select>
                    <input type="text" placeholder="Personnel Name / Rank" className="w-full p-2 border mb-4 rounded" onChange={e => setData({...data, personnel_name: e.target.value})} />
                    <input type="number" placeholder="Quantity" className="w-full p-2 border mb-4 rounded" onChange={e => setData({...data, qty: parseInt(e.target.value)})} />
                    <button onClick={() => submitLog('ASSIGNMENT')} className="bg-orange-600 text-white w-full py-2 rounded font-bold">Complete Assignment</button>
                </div>
                
                <div className="bg-white p-6 rounded shadow border">
                    <h2 className="font-bold text-lg mb-4 text-red-600">Log Expended Assets</h2>
                    <p className="text-sm text-gray-500 mb-4 italic text-center">Permanent deduction from stock</p>
                    <select className="w-full p-2 border mb-4 rounded" onChange={e => setData({...data, asset_id: e.target.value})}>
                        <option value="1">M4 Carbine</option>
                        <option value="2">Armored Jeep</option>
                    </select>
                    <input type="number" placeholder="Quantity Expended" className="w-full p-2 border mb-4 rounded" onChange={e => setData({...data, qty: parseInt(e.target.value)})} />
                    <button onClick={() => submitLog('EXPENDITURE')} className="bg-red-600 text-white w-full py-2 rounded font-bold">Log Expenditure</button>
                </div>
            </div>

            {/* HISTORY TABLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personnel Assignment Table */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Personnel Assignment History</h3>
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b text-sm">
                                <tr>
                                    <th className="p-3">Personnel</th>
                                    <th className="p-3">Asset</th>
                                    <th className="p-3 text-right">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {assignHistory.map(row => (
                                    <tr key={row.id} className="border-b hover:bg-gray-50 text-gray-700">
                                        <td className="p-3 font-bold text-orange-700">{row.personnel_name}</td>
                                        <td className="p-3">{row.asset_name}</td>
                                        <td className="p-3 text-right font-bold text-orange-600">-{row.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expended Assets Table */}
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Expended Assets Log</h3>
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b text-sm">
                                <tr>
                                    <th className="p-3">Used Item</th>
                                    <th className="p-3 text-right">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {expendHistory.map(row => (
                                    <tr key={row.id} className="border-b hover:bg-gray-50 text-gray-700">
                                        <td className="p-3 font-medium text-red-700">{row.asset_name}</td>
                                        <td className="p-3 text-right font-bold text-red-600">-{row.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assignments;