import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Dashboard = () => {
    const [stats, setStats] = useState({ opening: 0, movement: 0, assigned: 0, closing: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/dashboard/summary`);
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-6 text-center font-bold">RETRIVING COMMAND DATA...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Logistics Overview</h2>
                <p className="text-gray-600">Live Database Operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Opening Balance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Opening Balance</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.opening}</h3>
                </div>
                
                {/* Net Movement - NOW SHOWING CALCULATIONS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-indigo-500">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Net Movement</p>
                    <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                        +{stats.opening + stats.movement}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-2 bg-gray-100 p-1 rounded font-mono">
                        Net : {stats.opening} + {stats.movement} <h3>               (Opening balance + Purchases)</h3>
                    </p>
                </div>

                {/* Assigned/Expended */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-orange-500">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Assigned / Expended</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.assigned}</h3>
                    <p className="text-[10px] text-gray-400 mt-2 font-mono italic">
                        Includes: Transfers & Assignments
                    </p>
                </div>

                {/* Closing Balance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-green-500">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Closing Balance</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.closing}</h3>
                    <p className="text-[10px] text-gray-400 mt-2 font-mono">
                        Net ({stats.opening + stats.movement}) - Out ({stats.assigned})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;