'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, FileText, Plus, Target } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [stats, setStats] = useState({ modules: 0, users: 0, certificates: 0 });
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock fetching for now if API not fully ready with auth middleware
                // const token = localStorage.getItem('token');
                // const res = await axios.get('http://localhost:5000/api/modules');
                // setModules(res.data);

                // Simulating data
                setTimeout(() => {
                    setStats({ modules: 5, users: 120, certificates: 85 });
                    setModules([
                        { _id: '1', title: 'Phishing Awareness', active: true },
                        { _id: '2', title: 'Password Security', active: true },
                        { _id: '3', title: 'Data Privacy', active: false },
                    ]);
                    setLoading(false);
                }, 1000);

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col p-6">
                <h1 className="text-2xl font-bold mb-10 text-white flex items-center gap-2">
                    <Target className="text-blue-500" /> Admin
                </h1>
                <nav className="space-y-4 flex-1">
                    <div className="flex items-center gap-3 bg-blue-600/20 text-blue-400 p-3 rounded-xl cursor-pointer">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                        <FileText className="w-5 h-5" /> Modules
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 p-3 rounded-xl hover:bg-white/5 cursor-pointer">
                        <Users className="w-5 h-5" /> Users
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Overview</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all">
                        <Plus className="w-4 h-4" /> Create Module
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Modules', value: stats.modules, icon: FileText, color: 'bg-purple-500' },
                        { label: 'Active Users', value: stats.users, icon: Users, color: 'bg-green-500' },
                        { label: 'Certificates Issued', value: stats.certificates, icon: Target, color: 'bg-yellow-500' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${stat.color} bg-opacity-20`}>
                                <stat.icon className={`w-8 h-8 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <h3 className="text-3xl font-bold">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Modules */}
                <section>
                    <h3 className="text-xl font-bold mb-4">Recent Modules</h3>
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700/50 text-gray-400">
                                <tr>
                                    <th className="p-4">Module Name</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : modules.map((m) => (
                                    <tr key={m._id} className="hover:bg-white/5">
                                        <td className="p-4 font-medium">{m.title}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${m.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {m.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-blue-400 cursor-pointer hover:underline">Edit</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
