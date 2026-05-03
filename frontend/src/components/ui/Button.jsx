import React from 'react';

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    title = '',
    ...props
}) => {
    const baseStyles = 'flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'border-2 border-primary/50 bg-primary hover:bg-primary-hover text-white shadow-neon-primary px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider',
        pill: 'border-2 border-primary/30 bg-[#0d1117]/80 hover:bg-primary/20 hover:border-primary/50 text-slate-100 px-8 py-3 rounded-full shadow-2xl backdrop-blur-xl font-black uppercase tracking-[0.2em] text-[12px]',
        secondary: 'border-2 border-primary/50 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold',
        dangerIcon: 'border-2 border-primary/50 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl',
        dangerPill: 'border-2 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/50 text-rose-400 px-8 py-3 rounded-full shadow-2xl backdrop-blur-xl font-black uppercase tracking-[0.2em] text-[12px]',
        ghost: 'text-slate-400 border-2 border-primary/50 hover:text-white hover:bg-slate-800 p-2 rounded-lg'
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
            title={title}
            {...props}
        >
            {children}
        </button>
    );
};