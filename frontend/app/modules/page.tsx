'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios'; // Import axios

export default function ModuleSelection() {
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchModules();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-6 md:p-12">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <Link href="/" className="flex items-center gap-3 text-green-400 mb-2 hover:opacity-80 transition-opacity">
                        <Shield className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-wide">CyberSafe</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        Select Training Module
                    </h1>
                </div>
                <div className="hidden md:block">
                    {/* User Profile / Progress could go here */}
                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            JD
                        </div>
                        <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-400">Trainee</p>
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module, index) => (
                        <motion.div
                            key={module._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-32 h-32 text-blue-400 transform rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                                        Module {index + 1}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <Clock className="w-3 h-3" />
                                        {module.time_limit} mins
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                    {module.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Award className="w-4 h-4 text-yellow-500" />
                                        <span>Pass: {module.cutoff_percentage}%</span>
                                    </div>

                                    <Link 
                                        href={`/quiz/${module._id}`}
                                        className="glass-button flex flex-row items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:bg-blue-600 hover:border-blue-500 transition-all border border-transparent"
                                    >
                                        Start <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Progress indicator (Mock) */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                                <div className="h-full bg-blue-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
