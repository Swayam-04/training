'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, FileText, ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminModules() {
    const router = useRouter();
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cutoff_percentage: 60,
        time_limit: 15
    });

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/modules`);
            setModules(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this module?')) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/modules/${id}`);
                fetchModules();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/modules`, formData);
            setShowModal(false);
            setFormData({ title: '', description: '', cutoff_percentage: 60, time_limit: 15 });
            fetchModules();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Module Management</h1>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" /> Create New Module
                </button>
            </header>

            {/* Module List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50 text-gray-400 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-6">Title</th>
                            <th className="p-6">Description</th>
                            <th className="p-6">Cutoff</th>
                            <th className="p-6">Time Limit</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading modules...</td></tr>
                        ) : modules.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No modules found. Create one to get started.</td></tr>
                        ) : modules.map((m) => (
                            <tr key={m._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6 font-medium text-lg">{m.title}</td>
                                <td className="p-6 text-gray-400 max-w-xs truncate">{m.description}</td>
                                <td className="p-6">{m.cutoff_percentage}%</td>
                                <td className="p-6">{m.time_limit} mins</td>
                                <td className="p-6 text-right space-x-3">
                                    <Link 
                                        href={`/admin/modules/${m._id}/questions`}
                                        className="inline-block text-blue-400 hover:text-blue-300 transition-colors" 
                                        title="Manage Questions"
                                    >
                                        <FileText className="w-5 h-5" />
                                    </Link>
                                    <button className="text-gray-400 hover:text-white transition-colors" title="Edit (Coming Soon)">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(m._id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl p-8 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Create New Module</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Module Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-white"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-white h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Cutoff %</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-white"
                                        value={formData.cutoff_percentage}
                                        onChange={e => setFormData({ ...formData, cutoff_percentage: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Time Limit (mins)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-white"
                                        value={formData.time_limit}
                                        onChange={e => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <Save className="w-5 h-5" /> Save Module
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
