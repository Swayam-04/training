'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Hand } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function QuizPage() {
    const params = useParams(); // params.id
    const router = useRouter();

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [direction, setDirection] = useState(0);

    // Swipe Logic
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/questions/${params.id}`);
                setQuestions(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [params.id]);

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Quiz...</div>;
    if (questions.length === 0) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">No questions in this module.</div>;

    const question = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const selectedAnswer = answers[question._id];

    const handleOptionSelect = (optionText: string) => {
        // Vibrate on tap for touch feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
        setAnswers({ ...answers, [question._id]: optionText });
    };

    const handleNext = () => {
        if (isLastQuestion) {
            submitQuiz();
        } else {
            setDirection(1);
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setDirection(-1);
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const submitQuiz = async () => {
        // Calculate score locally for immediate feedback or send to backend
        let score = 0;
        let total = 0;

        const payload = {
            user_id: '67b36f789abc123456789012', // Mock User ID or from Context
            module_id: params.id,
            answers: Object.entries(answers).map(([qId, ans]) => ({
                question_id: qId,
                selected_option: ans
            }))
        };

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/results/submit`, payload);
            // Redirect to result page with score
            router.push(`/result?score=${res.data.percentage}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x < -100) {
            // Swipe Left -> Next
            if (selectedAnswer || !isLastQuestion) handleNext(); // Prevent skipping last q without answer if we enforced it
        } else if (info.offset.x > 100) {
            // Swipe Right -> Prev
            handlePrev();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
            {/* Top Progress Bar */}
            <div className="h-4 bg-gray-800 w-full relative">
                <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex-1 flex flex-col p-6 md:p-12 max-w-5xl mx-auto w-full relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 text-gray-400">
                    <span className="text-lg">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span className="flex items-center gap-2 text-sm"><Hand className="w-4 h-4" /> Swipe to Navigate</span>
                </div>

                {/* Question Area */}
                <div className="relative flex-1 flex items-center">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={currentQuestionIndex}
                            custom={direction}
                            initial={{ x: direction * 300, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: direction * -300, opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                            className="w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 shadow-2xl"
                            style={{ x, opacity }}
                        >
                            {question.type === 'Scenario' && (
                                <div className="mb-6 p-6 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl text-blue-200 italic text-lg leading-relaxed">
                                    "{question.context}"
                                </div>
                            )}

                            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                                {question.text}
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {question.options.map((option: any, idx: number) => {
                                    const isSelected = selectedAnswer === option.text;
                                    return (
                                        <motion.button
                                            key={idx}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleOptionSelect(option.text)}
                                            className={`
                         w-full text-left p-6 md:p-8 rounded-2xl border-2 transition-all flex items-center justify-between group
                         ${isSelected
                                                    ? 'bg-blue-600 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                       `}
                                        >
                                            <span className={`text-2xl font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                {option.text}
                                            </span>
                                            {isSelected && <CheckCircle className="w-8 h-8 text-white" />}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Backup for Swipe) */}
                <div className="mt-8 flex justify-between items-center z-10">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="glass-button px-8 py-4 rounded-xl font-medium text-gray-400 disabled:opacity-30 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" /> Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!selectedAnswer}
                        className={`
               px-10 py-4 rounded-xl font-bold text-xl flex items-center gap-2 transition-all
               ${selectedAnswer
                                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1'
                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
             `}
                    >
                        {isLastQuestion ? 'Submit Quiz' : 'Next'}
                        {!isLastQuestion && <ArrowRight className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
