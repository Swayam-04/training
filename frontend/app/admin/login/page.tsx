'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';
import axios from 'axios';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'admin' || res.data.user.role === 'trainer') {
                router.push('/admin/dashboard');
            } else {
                setError('Unauthorized access');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                    <p className="text-gray-400">Secure Access Check</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white"
                                placeholder="admin@cyber.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2 text-sm">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
