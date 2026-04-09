'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, User, LayoutDashboard, Database } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden relative">
      {/* Background Particles (Animated) */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-20 blur-xl"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <ShieldCheck className="w-24 h-24 mx-auto text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            CyberSafe Training
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Next-Gen Interactive Cybersecurity Certification.
            Master the skills to protect your digital world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
        >
          {/* Trainee / Kiosk Mode */}
          <Link 
            href="/modules" 
            className="group p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-full flex flex-col items-center shadow-lg hover:shadow-green-500/20"
          >
              <User className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-2">Start Training</h2>
              <p className="text-gray-400">Access interactive modules and earn your certificate.</p>
          </Link>

          {/* Admin / Trainer Mode */}
          <Link href="/admin/login" className="group">
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-full flex flex-col items-center shadow-lg hover:shadow-blue-500/20">
              <LayoutDashboard className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
              <p className="text-gray-400">Manage modules, questions, and view analytics.</p>
            </div>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 text-gray-500 text-sm"
        >
          &copy; 2024 CyberSafe Enterprise Systems. Secure & Scalable.
        </motion.footer>
      </div>
    </main>
  );
}
