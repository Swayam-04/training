'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, ArrowLeft, Save, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ModuleQuestions() {
    const params = useParams(); // params.id
    const [questions, setQuestions] = useState<any[]>([]);
    const [moduleTitle, setModuleTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [qType, setQType] = useState('MCQ');
    const [qText, setQText] = useState('');
    const [qContext, setQContext] = useState(''); // For scenarios
    const [qPoints, setQPoints] = useState(10);
    const [options, setOptions] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [modRes, qRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/modules/${params.id}`),
                axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/questions/${params.id}`)
            ]);
            setModuleTitle(modRes.data.title);
            setQuestions(qRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this question?')) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/questions/${id}`);
                fetchData();
            } catch (err) { console.error(err); }
        }
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Prepare options based on type
            let finalOptions = options;
            if (qType === 'TrueFalse') {
                finalOptions = [
                    { text: 'True', isCorrect: options[0].isCorrect },
                    { text: 'False', isCorrect: options[1].isCorrect }
                ];
            }

            const payload = {
                module_id: params.id,
                text: qText,
                type: qType,
                points: qPoints,
                options: finalOptions,
                context: qType === 'Scenario' ? qContext : undefined
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/questions`, payload);
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setQText('');
        setQContext('');
        setQPoints(10);
        setOptions([
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
        ]);
    };

    const updateOptionText = (idx: number, text: string) => {
        const newOpts = [...options];
        newOpts[idx].text = text;
        setOptions(newOpts);
    };

    const setCorrectOption = (idx: number) => {
        const newOpts = options.map((o, i) => ({ ...o, isCorrect: i === idx }));
        setOptions(newOpts);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/modules" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <p className="text-gray-400 text-sm">Managing Questions for</p>
                        <h1 className="text-3xl font-bold">{moduleTitle}</h1>
                    </div>
                </div>
                <button
                    onClick={() => { setShowModal(true); resetForm(); }}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Question
                </button>
            </header>

            {/* Question List */}
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={q._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30">
                                    {q.type}
                                </span>
                                <span className="text-gray-400 text-sm">Question {idx + 1}</span>
                                <span className="text-gray-500 text-xs">({q.points} pts)</span>
                            </div>
                            {q.type === 'Scenario' && (
                                <div className="mb-2 p-3 bg-gray-900 rounded text-gray-300 italic text-sm border-l-2 border-purple-500">
                                    {q.context}
                                </div>
                            )}
                            <h3 className="text-xl font-medium mb-3">{q.text}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {q.options.map((opt: any, i: number) => (
                                    <div key={i} className={`text-sm flex items-center gap-2 ${opt.isCorrect ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                                        {opt.isCorrect ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4" />}
                                        {opt.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(q._id)} className="text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Question Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl p-8 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Add Question</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddQuestion} className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                                    <select
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                        value={qType}
                                        onChange={e => setQType(e.target.value)}
                                    >
                                        <option value="MCQ">Multiple Choice</option>
                                        <option value="TrueFalse">True / False</option>
                                        <option value="Scenario">Scenario Based</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Points</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                        value={qPoints}
                                        onChange={e => setQPoints(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            {qType === 'Scenario' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Scenario Context</label>
                                    <textarea
                                        required
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white h-24"
                                        placeholder="Describe the scenario..."
                                        value={qContext}
                                        onChange={e => setQContext(e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Question Text</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                    value={qText}
                                    onChange={e => setQText(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">Options (Select Correct Answer)</label>

                                {qType === 'TrueFalse' ? (
                                    <div className="flex gap-4">
                                        {['True', 'False'].map((val, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    const newOpts = [...options];
                                                    newOpts.forEach((o, i) => o.isCorrect = i === idx); // Reset implementation needed for TF
                                                    // Actually let's just use the options state logic but adapted
                                                    // Simplified: just buttons for T/F
                                                    setCorrectOption(idx);
                                                }}
                                                className={`flex-1 p-4 rounded-lg border cursor-pointer text-center font-bold ${options[idx].isCorrect ? 'bg-green-600 border-green-500' : 'bg-gray-700 border-gray-600'}`}
                                            >
                                                {val}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setCorrectOption(idx)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border ${opt.isCorrect ? 'bg-green-500 border-green-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'}`}
                                            >
                                                {opt.isCorrect ? <CheckCircle className="w-5 h-5" /> : (idx + 1)}
                                            </button>
                                            <input
                                                type="text"
                                                required
                                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                                                placeholder={`Option ${idx + 1}`}
                                                value={opt.text}
                                                onChange={e => updateOptionText(idx, e.target.value)}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4"
                            >
                                Save Question
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
