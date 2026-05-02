import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export const Input = React.forwardRef(({ 
    label, 
    error, 
    icon: Icon, 
    className = "", 
    containerClassName = "",
    ...props 
}, ref) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
            {label && (
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
            )}
            
            <div className="relative group">
                {Icon && (
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-rose-400' : 'text-slate-500 group-focus-within:text-violet-400'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                
                <input
                    ref={ref}
                    className={`
                        w-full bg-black/40 border rounded-2xl px-5 py-4 text-white placeholder-slate-600 
                        focus:outline-none focus:ring-4 transition-all duration-300
                        ${Icon ? 'pl-12' : ''}
                        ${error 
                            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' 
                            : 'border-slate-800 focus:border-violet-500/50 focus:ring-violet-500/10 hover:border-slate-700'
                        }
                        ${className}
                    `}
                    {...props}
                />

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500"
                        >
                            <ExclamationCircleIcon className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[10px] font-bold text-rose-400 uppercase tracking-wider ml-1"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
});

Input.displayName = "Input";
