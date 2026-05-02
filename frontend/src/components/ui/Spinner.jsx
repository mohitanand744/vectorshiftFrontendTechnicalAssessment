import React from "react";
import { motion } from "framer-motion";

export const Spinner = ({ label = "Processing" }) => {
  return (
    <div className="flex flex-col items-center gap-3">
        <div className="relative">
            <div className="absolute inset-0 rounded-full blur-[8px] bg-violet-500/30 animate-pulse" />
            <div className="w-10 h-10 border-[3px] border-violet-500/10 border-t-violet-500 rounded-full animate-spin relative z-10" />
        </div>
        
        {label && (
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] animate-pulse">
                {label}
            </span>
        )}
    </div>
  );
};
