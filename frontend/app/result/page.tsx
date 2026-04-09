'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, Home, RotateCcw, CheckCircle, XCircle, Award, ThumbsUp, Medal } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

function ResultContent() {
    const searchParams = useSearchParams();
    const scoreParam = searchParams.get('score');
    const [percentage, setPercentage] = useState(0);
    const [tier, setTier] = useState<any>(null);

    useEffect(() => {
        if (scoreParam) {
            const p = parseInt(scoreParam);
            setPercentage(p);
            determineTier(p);
        }
    }, [scoreParam]);

    const determineTier = (p: number) => {
        if (p >= 90) {
            setTier({
                name: 'Gold Champion',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/20',
                icon: Medal,
                message: 'Outstanding Performance! You are a cybersecurity champion.',
                animation: 'gold'
            });
        } else if (p >= 75) {
            setTier({
                name: 'Excellence',
                color: 'text-gray-300', // Silver
                bg: 'bg-gray-400/20',
                icon: Award,
                message: 'Great job! You have demonstrated excellent knowledge.',
                animation: 'silver'
            });
        } else if (p >= 60) {
            setTier({
                name: 'Achievement',
                color: 'text-blue-400',
                bg: 'bg-blue-500/20',
                icon: ThumbsUp,
                message: 'Good effort! You have passed the assessment.',
                animation: 'standard'
            });
        } else {
            setTier(null); // Fail
        }
    };

    const isPassed = percentage >= 60;

    const generateCertificate = async () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [800, 600]
        });

        // Verification URL (Mock)
        const verifyUrl = `${window.location.origin}/verify/CERT-${Date.now()}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);

        // Background
        doc.setFillColor(10, 10, 35);
        doc.rect(0, 0, 800, 600, 'F');

        // Border
        doc.setLineWidth(10);
        doc.setDrawColor(74, 222, 128); // Green
        doc.rect(20, 20, 760, 560);

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(50);
        doc.text('CERTIFICATE OF COMPLETION', 400, 100, { align: 'center' });

        // Subtitle
        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text('This verifies that', 400, 160, { align: 'center' });

        // Name
        doc.setFontSize(45);
        doc.setTextColor(74, 222, 128);
        doc.text('John Doe', 400, 230, { align: 'center' }); // Mock Name

        // Description
        doc.setFontSize(20);
        doc.setTextColor(200, 200, 200);
        doc.text('Has successfully completed the training module:', 400, 290, { align: 'center' });

        doc.setFontSize(35);
        doc.setTextColor(255, 255, 255);
        doc.text('Cybersecurity Awareness', 400, 350, { align: 'center' });

        // Score
        doc.setFontSize(20);
        doc.setTextColor(200, 200, 200);
        doc.text(`Score Achieved: ${percentage}%`, 400, 420, { align: 'center' });

        // Date
        const date = new Date().toLocaleDateString();
        doc.text(`Date: ${date}`, 400, 460, { align: 'center' });

        // QR Code
        doc.addImage(qrCodeDataUrl, 'PNG', 350, 480, 100, 100);

        doc.save('certificate.pdf');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Animation based on Tier */}
            {isPassed && tier?.animation === 'gold' && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                            initial={{ x: Math.random() * 1000, y: -20 }}
                            animate={{ y: 1000, rotate: 360 }}
                            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                            style={{ left: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>
            )}

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 p-12 rounded-3xl shadow-2xl max-w-3xl w-full text-center border border-gray-700 relative z-10"
            >
                <div className="flex justify-center mb-8">
                    {isPassed ? (
                        tier ? (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`p-6 rounded-full ${tier.bg} ${tier.color} border-4 border-current`}
                            >
                                <tier.icon className="w-24 h-24" />
                            </motion.div>
                        ) : (
                            <CheckCircle className="w-24 h-24 text-green-500" />
                        )
                    ) : (
                        <motion.div
                            initial={{ x: -10 }}
                            animate={{ x: 10 }}
                            transition={{ repeat: 5, repeatType: "reverse", duration: 0.1 }}
                        >
                            <XCircle className="w-24 h-24 text-red-500" />
                        </motion.div>
                    )}
                </div>

                <h1 className="text-5xl font-bold mb-4 text-white">
                    {isPassed ? (tier ? tier.name : 'Passed') : 'Module Failed'}
                </h1>

                <p className="text-gray-300 text-xl mb-8 max-w-xl mx-auto">
                    {isPassed
                        ? tier?.message
                        : 'Don\'t give up! Review the training material and try again to earn your certificate.'}
                </p>

                {/* Score Meter */}
                <div className="mb-10 relative h-8 bg-gray-700 rounded-full overflow-hidden max-w-md mx-auto">
                    <div className="absolute top-0 bottom-0 left-[60%] w-1 bg-white/50 z-10" title="Pass Mark" />
                    <motion.div
                        className={`h-full ${isPassed ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-sm drop-shadow-md">
                        {percentage}% Score
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isPassed ? (
                        <button
                            onClick={generateCertificate}
                            className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 px-8 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1"
                        >
                            <Download className="w-6 h-6" /> Download Certificate
                        </button>
                    ) : (
                        <Link href="/modules" className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold transition-all w-full">
                            <RotateCcw className="w-6 h-6" /> Retry Module
                        </Link>
                    )}

                    <Link href="/" className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white py-4 px-8 rounded-xl font-bold transition-all w-full">
                        <Home className="w-6 h-6" /> Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div>Loading Result...</div>}>
            <ResultContent />
        </Suspense>
    );
}
