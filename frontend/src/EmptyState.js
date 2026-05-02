import { motion } from 'framer-motion';

export const EmptyState = ({ 
    icon: Icon, 
    title = "Nothing here yet", 
    message = "Start building to see results here.",
    className = "" 
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`py-16 flex flex-col items-center justify-center text-center px-6 ${className}`}
        >
            <div className="relative mb-6">
                {/* Decorative background glow */}
                <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                
                <div className="relative w-20 h-20 bg-slate-800/40 border border-slate-700/50 rounded-3xl flex items-center justify-center text-slate-500 backdrop-blur-xl shadow-2xl">
                    <Icon className="w-10 h-10 opacity-40" />
                </div>
            </div>

            <h4 className="text-lg font-bold text-slate-200 mb-2 tracking-tight">
                {title}
            </h4>
            <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed italic">
                {message}
            </p>
        </motion.div>
    );
};
