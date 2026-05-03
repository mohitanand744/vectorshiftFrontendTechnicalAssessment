import React from 'react';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

export const ProjectHeader = ({ onNewProject, onRename }) => {
    const { currentProjectName, nodes } = useStore(
        (state) => ({
            currentProjectName: state.currentProjectName,
            nodes: state.nodes
        }),
        shallow
    );

    const handleNewClick = () => {
        onNewProject();
    };

    return (
        <div className="absolute top-20 xl:top-8 left-0 sm:left-4 md:left-8 z-[50] flex items-center w-full sm:w-auto gap-2 md:gap-4 px-3 md:px-6 py-2 md:py-3 bg-slate-950/80 backdrop-blur-2xl border border-slate-800/50 rounded-2xl md:rounded-3xl shadow-2xl animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2 md:gap-3"> 
                <div className="flex flex-col items-start">
                    <span className="hidden md:block text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] leading-none mb-1.5">Active Pipeline</span>
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={onRename}>
                        <h2 className="text-sm md:text-lg font-bold text-white tracking-tight leading-none truncate min-w-[100px] md:max-w-[150px] md:max-w-none">{currentProjectName}</h2>
                        <PencilSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="w-px h-6 md:h-8 bg-slate-800 mx-1 md:mx-2" />

            <Button
                onClick={handleNewClick}
                variant="ghost"
                className="!px-3 md:!px-4 !py-1.5 md:!py-2 !rounded-xl md:!rounded-2xl hover:bg-violet-500/10 hover:text-violet-400 transition-all gap-1.5 md:gap-2"
                title="Create a fresh pipeline"
            >
                <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:block text-xs md:text-sm font-bold">New</span>
            </Button>
        </div>
    );
};
