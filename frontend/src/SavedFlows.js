import { XMarkIcon, ClockIcon, TrashIcon, PlayIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from './store';
import { EmptyState } from './EmptyState';
import { Button } from './Button';



export const SavedFlows = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const setNodes = useStore((state) => state.setNodes);
    const setEdges = useStore((state) => state.setEdges);
    const setCurrentFlowId = useStore((state) => state.setCurrentFlowId);



    useEffect(() => {
        if (isOpen) {
            const saved = JSON.parse(localStorage.getItem('saved_flows') || '[]');
            setHistory(saved);
        }
    }, [isOpen]);

    const clearHistory = () => {
        localStorage.removeItem('saved_flows');
        setHistory([]);
    };

    const loadFlow = (item) => {
        if (Array.isArray(item.nodes) && Array.isArray(item.edges)) {
            setNodes(item.nodes);
            setEdges(item.edges);
            setCurrentFlowId(item.id);
            onClose();
        }
    };


    const getCount = (data, statsValue) => {
        if (statsValue !== undefined) return statsValue;
        if (Array.isArray(data)) return data.length;
        return data; // already a number
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0d1117] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Background Image Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <img
                                src="./purple_bg.webp"
                                className="w-full h-full object-cover object-right"
                                alt="background"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/5 pointer-events-none" />

                        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                                    <ClockIcon className="w-8 h-8" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Saved Flows</h3>
                                    <p className="text-md text-slate-500">Restore a previously saved pipeline configuration.</p>
                                </div>
                            </div>
                            <Button onClick={onClose} variant="dangerIcon">
                                <XMarkIcon className="w-5 h-5" />
                            </Button>

                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <div key={item.id} className="bg-slate-800/20 border border-slate-700/30 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/40 transition-all">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] font-black text-primary uppercase tracking-widest">Snapshot</span>
                                                <span className="text-sm font-bold text-slate-100">{new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] text-slate-500 uppercase font-bold tracking-widest">Nodes</span>
                                                    <span className="text-lg font-bold text-slate-200">{getCount(item.nodes, item.stats?.nodes)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] text-slate-500 uppercase font-bold tracking-widest">Edges</span>
                                                    <span className="text-lg font-bold text-slate-200">{getCount(item.edges, item.stats?.edges)}</span>
                                                </div>
                                            </div>

                                        </div>
                                        <Button
                                            onClick={() => loadFlow(item)}
                                            variant="ghost"
                                            className="hover:text-emerald-400 hover:bg-emerald-500/10"
                                            title="Restore this flow"
                                        >
                                            <PlayIcon className="w-5 h-5 rotate-180" />
                                        </Button>


                                    </div>
                                ))
                            ) : (
                                <EmptyState 
                                    icon={ClockIcon} 
                                    title="No History" 
                                    message="No recent executions found. Submit a pipeline to save it here."
                                />
                            )}

                        </div>

                        {history.length > 0 && (
                            <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-end">
                                <Button
                                    onClick={clearHistory}
                                    variant="ghost"
                                    className="text-rose-400 hover:text-rose-300 uppercase tracking-widest text-[10px] font-black"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Clear All Past Executions
                                </Button>

                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};