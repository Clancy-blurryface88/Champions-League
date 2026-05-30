import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';

export default function PlayerStatsModal({ isOpen, onClose, selectedPlayer: initialSelectedPlayer, allParticipants }) {
    const [selectedPlayer, setSelectedPlayer] = useState(initialSelectedPlayer);

    useEffect(() => {
        if (isOpen && initialSelectedPlayer) {
            setSelectedPlayer(initialSelectedPlayer);
        }
    }, [isOpen, initialSelectedPlayer]);

    useEffect(() => {
        if (!isOpen) return;
        window.history.pushState({ modal: 'player-stats' }, '');
        const handlePop = () => onClose();
        window.addEventListener('popstate', handlePop);
        return () => window.removeEventListener('popstate', handlePop);
    }, [isOpen, onClose]);

    if (!selectedPlayer || !allParticipants) return null;

    const selectedPoints = selectedPlayer.total_points || 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-[70] bg-[#0f172a] md:rounded-2xl shadow-2xl md:max-h-[85vh] md:w-full md:max-w-md flex flex-col overflow-hidden"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="relative pt-8 pb-4 px-4 text-center flex-shrink-0 bg-gradient-to-b from-blue-900/20 to-transparent">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="absolute top-4 left-4 z-10 text-slate-400 hover:text-white hover:bg-white/10 h-12 w-12"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                            
                            <div className="flex justify-center mb-2">
                                <img 
                                    src="/wc-trophy.png"
                                    alt="Trophy"
                                    className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                />
                            </div>
                            
                            <h2 className="text-xl font-bold text-blue-400 mb-1"></h2>
                            <p className="text-slate-400 text-xs">לחץ על משתתף ובדוק את פער הנקודות</p>
                        </div>

                        {/* Table */}
                        <div className="overflow-y-auto flex-1 px-3 pb-4 space-y-2">
                            {allParticipants.map((p, index) => {
                                const diff = (p.total_points || 0) - selectedPoints;
                                const isSelected = p.id === selectedPlayer.id;
                                const isAhead = diff > 0;
                                const isBehind = diff < 0;

                                return (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        onClick={() => setSelectedPlayer(p)}
                                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 border cursor-pointer transition-all ${
                                            isSelected
                                                ? 'bg-slate-800/80 border-slate-600 shadow-[0_0_10px_rgba(0,0,0,0.3)]'
                                                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'
                                        }`}
                                    >
                                        {/* Rank + Name */}
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                                p.position === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                                                p.position === 2 ? 'bg-gray-400/20 text-gray-300' :
                                                p.position === 3 ? 'bg-amber-600/20 text-amber-500' :
                                                'bg-slate-700/50 text-slate-400'
                                            }`}>
                                                {p.position}
                                            </div>
                                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                                {p.full_name}
                                            </span>
                                        </div>

                                        {/* Points + Diff */}
                                        <div className="text-left flex flex-col items-end">
                                            <span className="text-yellow-400 font-bold text-base">
                                                {parseFloat(p.total_points || 0).toFixed(2)}
                                            </span>
                                            <div className="h-4 flex items-center mt-0.5">
                                                {!isSelected && diff !== 0 && (
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isAhead ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {isAhead ? '+' : ''}{parseFloat(diff).toFixed(2)}
                                                    </span>
                                                )}
                                                {isSelected && (
                                                    <span className="text-[10px] text-slate-400">נבחר</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}