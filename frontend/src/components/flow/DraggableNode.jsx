import React from "react";
import { motion } from "framer-motion";

export const DraggableNode = ({ type, label, icon: Icon, color, onClick }) => {
    const onDragStart = (event, nodeType) => {
        const appData = { nodeType };
        event.dataTransfer.setData("application/reactflow", JSON.stringify(appData));
        event.dataTransfer.effectAllowed = "move";
    };

    const colorClasses = {
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.1)]",
        rose: "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        violet: "text-violet-400 bg-violet-500/10 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(129,140,248,0.1)]",
        amber: "text-amber-400 bg-amber-500/10 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]",
        fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_15px_rgba(232,121,249,0.1)]",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(251,146,60,0.1)]",
    };

    const colorClass = colorClasses[color] || colorClasses.violet;

    return (
        <motion.div
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
                flex flex-col items-center justify-center gap-3 p-4 
                rounded-2xl border transition-all duration-300 cursor-grab active:cursor-grabbing
                ${colorClass}
                hover:border-white/20
            `}
            onDragStart={(event) => onDragStart(event, type)}
            onClick={() => onClick(type)}
            draggable
        >
            <div className="p-2 rounded-xl bg-black/20">
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </motion.div>
    );
};
